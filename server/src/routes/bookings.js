import bcrypt from "bcryptjs";
import crypto from "crypto";
import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Delivery from "../models/Delivery.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import { calculateDynamicPrice } from "../services/ai/pricing.js";
import { scoreBookingFraud } from "../services/ai/fraud.js";
import { matchBestRider } from "../services/ai/riderMatching.js";

const router = express.Router();

function bookingPopulate(query) {
  return query
    .populate("customer", "name phone email location")
    .populate("owner", "name phone email location")
    .populate("rider", "name phone rating location availability")
    .populate("vehicle");
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "customer") filter.customer = req.user._id;
    if (req.user.role === "owner") filter.owner = req.user._id;
    if (req.user.role === "rider") filter.rider = req.user._id;
    if (req.query.status) filter.status = req.query.status;

    const bookings = await bookingPopulate(Booking.find(filter)).sort("-createdAt");
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("customer", "admin"), async (req, res, next) => {
  try {
    const { vehicleId, startAt, endAt, deliveryLocation, notes } = req.body;
    const vehicle = await Vehicle.findById(vehicleId).populate("owner");

    if (!vehicle || vehicle.approvalStatus !== "approved" || vehicle.availability !== "available") {
      return res.status(400).json({ message: "Vehicle is not available for booking" });
    }

    const start = new Date(startAt);
    const end = new Date(endAt);
    const durationHours = Math.max(1, Math.ceil((end - start) / 36e5));
    const price = await calculateDynamicPrice(vehicle, { startAt: start, city: vehicle.location?.city });
    const baseAmount = durationHours * price.hourlyRate;
    const deliveryFee = 120;
    const securityDeposit = vehicle.securityDeposit;
    const platformCommission = Math.round(baseAmount * 0.15);
    const ownerPayout = baseAmount - platformCommission;
    const totalAmount = baseAmount + deliveryFee + securityDeposit;
    const rider = await matchBestRider(vehicle.location, deliveryLocation);
    const otp = String(crypto.randomInt(100000, 999999));
    const fraudScore = await scoreBookingFraud(req.user, vehicle, { deliveryLocation, totalAmount });

    const booking = await Booking.create({
      customer: req.user._id,
      owner: vehicle.owner._id,
      rider: rider?._id,
      vehicle: vehicle._id,
      pickupLocation: vehicle.location,
      deliveryLocation,
      startAt: start,
      endAt: end,
      durationHours,
      baseAmount,
      dynamicMultiplier: price.multiplier,
      deliveryFee,
      securityDeposit,
      platformCommission,
      ownerPayout,
      totalAmount,
      status: rider ? "assigned" : "confirmed",
      otpHash: await bcrypt.hash(otp, 10),
      otpExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
      fraudScore,
      notes
    });

    vehicle.availability = "booked";
    vehicle.totalBookings += 1;
    await vehicle.save();

    if (rider) {
      rider.availability = "busy";
      await rider.save();
      await Delivery.create({
        booking: booking._id,
        rider: rider._id,
        currentLocation: rider.location,
        routeSummary: `Pickup from ${vehicle.location?.label || vehicle.location?.city || "owner"} and deliver to ${deliveryLocation?.label || "customer"}`
      });
    }

    const populated = await bookingPopulate(Booking.findById(booking._id));
    res.status(201).json({ booking: populated, handoverOtp: otp });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const allowed = [booking.customer, booking.owner, booking.rider].filter(Boolean).map(String);
    if (!allowed.includes(String(req.user._id)) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You cannot update this booking" });
    }

    booking.status = req.body.status || booking.status;
    await booking.save();
    const populated = await bookingPopulate(Booking.findById(booking._id));
    res.json({ booking: populated });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/pay", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.customer) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only the customer can pay for this booking" });
    }

    const payment = await Payment.create({
      booking: booking._id,
      customer: booking.customer,
      owner: booking.owner,
      amount: booking.totalAmount,
      deposit: booking.securityDeposit,
      platformCommission: booking.platformCommission,
      ownerPayout: booking.ownerPayout,
      method: req.body.method || "upi",
      transactionId: `MOCK-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
    });

    booking.paymentStatus = "paid";
    booking.status = booking.status === "pending" ? "confirmed" : booking.status;
    await booking.save();
    await User.findByIdAndUpdate(booking.owner, { $inc: { earnings: booking.ownerPayout } });
    res.status(201).json({ payment, booking });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/verify-otp", requireAuth, requireRole("rider", "admin"), async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).select("+otpHash");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.rider && String(booking.rider) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "This delivery is assigned to another rider" });
    }
    if (!booking.otpHash || booking.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const valid = await bcrypt.compare(String(req.body.otp || ""), booking.otpHash);
    if (!valid) return res.status(400).json({ message: "Invalid OTP" });

    booking.status = "delivered";
    booking.otpHash = undefined;
    await booking.save();
    await Delivery.findOneAndUpdate({ booking: booking._id }, { status: "delivered", etaMinutes: 0 });
    res.json({ message: "Vehicle handover confirmed", booking });
  } catch (error) {
    next(error);
  }
});

export default router;

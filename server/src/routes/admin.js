import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import { predictDemand } from "../services/ai/demand.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/analytics", async (req, res, next) => {
  try {
    const [users, vehicles, bookings, payments, fraudAlerts, demand] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      Booking.countDocuments(),
      Payment.find({ status: "success" }),
      Booking.find({ fraudScore: { $gte: 65 } }).populate("customer vehicle").sort("-createdAt").limit(10),
      predictDemand()
    ]);
    const revenue = payments.reduce((sum, payment) => sum + payment.platformCommission, 0);
    res.json({ users, vehicles, bookings, revenue, fraudAlerts, demand });
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.patch("/vehicles/:id/approval", async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: req.body.approvalStatus || "approved" },
      { new: true }
    ).populate("owner", "name email phone");
    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
});

export default router;

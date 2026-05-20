import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Delivery from "../models/Delivery.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === "rider" ? { rider: req.user._id } : {};
    const deliveries = await Delivery.find(filter)
      .populate({
        path: "booking",
        populate: [
          { path: "vehicle" },
          { path: "customer", select: "name phone location" },
          { path: "owner", select: "name phone location" }
        ]
      })
      .populate("rider", "name phone rating location")
      .sort("-createdAt");
    res.json({ deliveries });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", requireAuth, requireRole("rider", "admin"), async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    if (String(delivery.rider) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "This delivery is assigned to another rider" });
    }

    const { status, currentLocation, etaMinutes } = req.body;
    if (status) delivery.status = status;
    if (currentLocation) {
      delivery.currentLocation = currentLocation;
      delivery.tracking.push(currentLocation);
    }
    if (etaMinutes !== undefined) delivery.etaMinutes = etaMinutes;
    await delivery.save();

    const bookingStatusByDelivery = {
      picked_up: "picked_up",
      delivered: "delivered"
    };
    if (bookingStatusByDelivery[delivery.status]) {
      await Booking.findByIdAndUpdate(delivery.booking, { status: bookingStatusByDelivery[delivery.status] });
    }

    const io = req.app.get("io");
    io?.to(String(delivery.booking)).emit("delivery:update", delivery);
    res.json({ delivery });
  } catch (error) {
    next(error);
  }
});

export default router;

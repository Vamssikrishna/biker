import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

async function updateRating(model, id) {
  const key = model === Vehicle ? "vehicle" : "rider";
  const reviews = await Review.find({ [key]: id });
  if (!reviews.length) return;
  const rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  await model.findByIdAndUpdate(id, { rating: Number(rating.toFixed(1)), totalRatings: reviews.length });
}

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only the customer can review this booking" });
    }

    const review = await Review.create({
      booking: booking._id,
      author: req.user._id,
      vehicle: booking.vehicle,
      owner: booking.owner,
      rider: booking.rider,
      targetType: req.body.targetType,
      rating: req.body.rating,
      comment: req.body.comment
    });

    if (req.body.targetType === "vehicle") await updateRating(Vehicle, booking.vehicle);
    if (req.body.targetType === "rider" && booking.rider) await updateRating(User, booking.rider);
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.vehicle) filter.vehicle = req.query.vehicle;
    if (req.query.rider) filter.rider = req.query.rider;
    const reviews = await Review.find(filter).populate("author", "name avatar").sort("-createdAt");
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

export default router;

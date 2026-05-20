import Booking from "../../models/Booking.js";
import Payment from "../../models/Payment.js";
import { distanceKm } from "./distance.js";

export async function detectUserRisk(user) {
  const [recentBookings, failedPayments] = await Promise.all([
    Booking.countDocuments({ customer: user._id, createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24) } }),
    Payment.countDocuments({ customer: user._id, status: "failed" })
  ]);

  let score = 0;
  if (recentBookings >= 4) score += 35;
  if (failedPayments >= 2) score += 30;
  if (!user.phone) score += 15;
  if (!user.location?.lat) score += 10;

  return {
    score: Math.min(100, score),
    level: score >= 65 ? "high" : score >= 35 ? "medium" : "low",
    signals: { recentBookings, failedPayments, missingPhone: !user.phone }
  };
}

export async function scoreBookingFraud(user, vehicle, booking) {
  const risk = await detectUserRisk(user);
  let score = risk.score;
  const locationJump = distanceKm(user.location, booking.deliveryLocation);

  if (booking.totalAmount > 15000) score += 15;
  if (locationJump > 50) score += 20;
  if (vehicle.owner && String(vehicle.owner._id || vehicle.owner) === String(user._id)) score += 40;

  return Math.min(100, score);
}

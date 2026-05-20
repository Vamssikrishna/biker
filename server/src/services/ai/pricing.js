import Booking from "../../models/Booking.js";

export async function calculateDynamicPrice(vehicle, context = {}) {
  const hour = context.startAt ? new Date(context.startAt).getHours() : new Date().getHours();
  const city = context.city || vehicle.location?.city;
  const rushHourMultiplier = hour >= 8 && hour <= 11 ? 1.18 : hour >= 17 && hour <= 21 ? 1.22 : 1;
  const recentDemand = city
    ? await Booking.countDocuments({
        "pickupLocation.city": city,
        createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) }
      })
    : 0;
  const demandMultiplier = Math.min(1.35, 1 + recentDemand * 0.015);
  const scarcityMultiplier = vehicle.type === "car" ? 1.08 : 1;
  const multiplier = Number((rushHourMultiplier * demandMultiplier * scarcityMultiplier).toFixed(2));
  const hourlyRate = Math.round(vehicle.pricePerHour * multiplier);
  const dailyRate = Math.round(vehicle.pricePerDay * multiplier);

  return {
    hourlyRate,
    dailyRate,
    multiplier,
    reasons: {
      rushHour: rushHourMultiplier > 1,
      recentDemand,
      scarcity: scarcityMultiplier > 1
    }
  };
}

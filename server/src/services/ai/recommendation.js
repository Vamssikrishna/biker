import Booking from "../../models/Booking.js";
import Vehicle from "../../models/Vehicle.js";
import { distanceKm } from "./distance.js";

export async function recommendVehicles(user, filters = {}) {
  const history = await Booking.find({ customer: user._id }).populate("vehicle").sort("-createdAt").limit(20);
  const preferredType =
    filters.type ||
    history
      .map((booking) => booking.vehicle?.type)
      .filter(Boolean)
      .sort((a, b) => history.filter((x) => x.vehicle?.type === b).length - history.filter((x) => x.vehicle?.type === a).length)[0];
  const avgPrice =
    history.length > 0
      ? history.reduce((sum, booking) => sum + (booking.vehicle?.pricePerHour || 0), 0) / history.length
      : Number(filters.maxPrice || 400);

  const query = { approvalStatus: "approved", availability: "available" };
  if (preferredType) query.type = preferredType;
  if (filters.city) query["location.city"] = new RegExp(filters.city, "i");

  const vehicles = await Vehicle.find(query).populate("owner", "name rating location").limit(80);
  const origin = user.location || filters;

  return vehicles
    .map((vehicle) => {
      const priceFit = Math.max(0, 30 - Math.abs(vehicle.pricePerHour - avgPrice) / 10);
      const popularity = Math.min(25, vehicle.totalBookings * 2 + vehicle.rating * 3);
      const proximity = Math.max(0, 35 - distanceKm(origin, vehicle.location));
      const score = Number((priceFit + popularity + proximity).toFixed(2));
      return { ...vehicle.toObject(), recommendationScore: score };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 12);
}

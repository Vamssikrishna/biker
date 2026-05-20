import User from "../../models/User.js";
import { distanceKm } from "./distance.js";

export async function matchBestRider(vehicleLocation = {}, deliveryLocation = {}) {
  const riders = await User.find({ role: "rider", availability: "available", status: "active" });

  return riders
    .map((rider) => {
      const pickupDistance = distanceKm(rider.location, vehicleLocation);
      const dropDistance = distanceKm(vehicleLocation, deliveryLocation);
      const ratingBoost = (rider.rating || 4.5) * 2;
      const score = pickupDistance * 3 + dropDistance - ratingBoost;
      return { rider, score };
    })
    .sort((a, b) => a.score - b.score)[0]?.rider;
}

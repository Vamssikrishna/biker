import Booking from "../../models/Booking.js";

export async function predictDemand() {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
  const rows = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: "$pickupLocation.city",
        bookings: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
        avgFraud: { $avg: "$fraudScore" }
      }
    },
    { $sort: { bookings: -1 } },
    { $limit: 8 }
  ]);

  return rows.map((row) => {
    const demandScore = Math.min(100, Math.round(row.bookings * 12 + row.revenue / 1000));
    return {
      city: row._id || "Unknown",
      bookings: row.bookings,
      revenue: row.revenue,
      demandScore,
      prediction: demandScore > 70 ? "high" : demandScore > 35 ? "medium" : "low",
      fraudWatch: row.avgFraud > 50
    };
  });
}

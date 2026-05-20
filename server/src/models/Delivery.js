import mongoose from "mongoose";

const trackingPointSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    recordedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["assigned", "arriving_pickup", "picked_up", "arriving_customer", "delivered"],
      default: "assigned"
    },
    currentLocation: {
      lat: Number,
      lng: Number
    },
    etaMinutes: { type: Number, default: 20 },
    routeSummary: String,
    tracking: [trackingPointSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);

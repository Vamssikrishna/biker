import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    label: String,
    address: String,
    city: String,
    lat: Number,
    lng: Number
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    pickupLocation: pointSchema,
    deliveryLocation: pointSchema,
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    durationHours: { type: Number, required: true },
    baseAmount: { type: Number, required: true },
    dynamicMultiplier: { type: Number, default: 1 },
    deliveryFee: { type: Number, default: 120 },
    securityDeposit: { type: Number, default: 0 },
    platformCommission: { type: Number, default: 0 },
    ownerPayout: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "assigned", "picked_up", "delivered", "active", "completed", "cancelled"],
      default: "pending"
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    otpHash: { type: String, select: false },
    otpExpiresAt: Date,
    fraudScore: { type: Number, default: 0 },
    notes: String
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, createdAt: -1 });
bookingSchema.index({ rider: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);

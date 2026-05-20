import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetType: { type: String, enum: ["vehicle", "owner", "rider"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);

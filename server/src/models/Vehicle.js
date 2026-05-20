import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    label: String,
    address: String,
    city: String,
    lat: Number,
    lng: Number
  },
  { _id: false }
);

const vehicleSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["bike", "car"], required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: Number,
    registrationNumber: { type: String, required: true, unique: true },
    description: String,
    images: [String],
    documents: [{ name: String, url: String, verified: { type: Boolean, default: false } }],
    pricePerHour: { type: Number, required: true, min: 1 },
    pricePerDay: { type: Number, required: true, min: 1 },
    securityDeposit: { type: Number, default: 1000 },
    location: locationSchema,
    features: [String],
    fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], default: "petrol" },
    transmission: { type: String, enum: ["manual", "automatic", "gearless"], default: "manual" },
    availability: { type: String, enum: ["available", "booked", "maintenance"], default: "available" },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    rating: { type: Number, default: 4.7 },
    totalRatings: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

vehicleSchema.index({ type: 1, approvalStatus: 1, availability: 1 });
vehicleSchema.index({ "location.city": 1, pricePerHour: 1 });

export default mongoose.model("Vehicle", vehicleSchema);

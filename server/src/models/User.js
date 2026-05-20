import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const locationSchema = new mongoose.Schema(
  {
    label: String,
    address: String,
    city: String,
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.209 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"]
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["customer", "owner", "rider", "admin"],
      default: "customer"
    },
    avatar: String,
    location: locationSchema,
    documents: [{ name: String, url: String, verified: { type: Boolean, default: false } }],
    status: { type: String, enum: ["active", "suspended"], default: "active" },
    availability: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    rating: { type: Number, default: 4.8 },
    totalRatings: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);

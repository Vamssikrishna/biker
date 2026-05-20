import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    platformCommission: { type: Number, default: 0 },
    ownerPayout: { type: Number, default: 0 },
    method: { type: String, enum: ["card", "upi", "wallet", "cash"], default: "upi" },
    provider: { type: String, default: "mock-pay" },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "success" }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);

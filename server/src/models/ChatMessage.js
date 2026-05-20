import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    metadata: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);

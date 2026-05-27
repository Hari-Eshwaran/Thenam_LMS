import mongoose from "mongoose";

const aiHistorySchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true, index: true },
    student_id: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    sources: { type: Array, default: [] },
    tokens_used: { type: Number, default: 0 },
  },
  {
    collection: "ai_history",
    timestamps: true,
  },
);

aiHistorySchema.index({ session_id: 1, createdAt: -1 });

export const AiHistory = mongoose.model("AiHistory", aiHistorySchema);

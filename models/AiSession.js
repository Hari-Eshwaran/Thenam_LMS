import mongoose from "mongoose";

const aiSessionSchema = new mongoose.Schema(
  {
    session_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    message_count: { type: Number, default: 0 },
    last_message_at: { type: Date, default: Date.now },
  },
  {
    collection: "ai_sessions",
    timestamps: true,
  },
);

aiSessionSchema.index({ student_id: 1, subject: 1, last_message_at: -1 });

export const AiSession = mongoose.model("AiSession", aiSessionSchema);

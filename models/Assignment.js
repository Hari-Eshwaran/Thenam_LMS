import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, required: true, unique: true, index: true },
    class_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
  },
  {
    collection: "assignments",
    timestamps: true,
  },
);

assignmentSchema.index({ class_id: 1, subject: 1, createdAt: -1 });

export const Assignment = mongoose.model("Assignment", assignmentSchema);

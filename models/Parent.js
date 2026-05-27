import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    parent_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
  },
  {
    collection: "parents",
    timestamps: true,
  },
);

parentSchema.index({ student_id: 1, parent_id: 1 });

export const Parent = mongoose.model("Parent", parentSchema);

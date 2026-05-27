import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    class_id: { type: String, required: true, unique: true, index: true },
    grade: { type: Number, required: true },
    section: { type: String, required: true },
  },
  {
    collection: "classes",
    timestamps: true,
  },
);

classSchema.index({ grade: 1, section: 1 });

export const Class = mongoose.model("Class", classSchema);

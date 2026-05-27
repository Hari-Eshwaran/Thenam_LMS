import mongoose from "mongoose";

const mappingSchema = new mongoose.Schema(
  {
    class_id: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    teacher_id: { type: String, required: true, index: true },
  },
  {
    collection: "class_subject_teacher",
    timestamps: true,
  },
);

mappingSchema.index({ class_id: 1, subject: 1 }, { unique: true });
mappingSchema.index({ teacher_id: 1, class_id: 1 });

export const Mapping = mongoose.model("Mapping", mappingSchema);

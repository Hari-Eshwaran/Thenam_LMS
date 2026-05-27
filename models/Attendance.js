import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    class_id: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    status: { type: String, required: true, enum: ["present", "absent", "late", "excused"] },
  },
  {
    collection: "attendance",
    timestamps: true,
  },
);

attendanceSchema.index({ student_id: 1, date: -1 });
attendanceSchema.index({ class_id: 1, date: -1 });
attendanceSchema.index({ class_id: 1, student_id: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notification_id: { type: String, required: true, unique: true, index: true },
    student_id: { type: String, required: true, index: true },
    class_id: { type: String, index: true },
    parent_id: { type: String, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, required: true, default: "brand" },
    read: { type: Boolean, default: false, index: true },
    metadata: { type: Object, default: {} },
  },
  {
    collection: "notifications",
    timestamps: true,
  },
);

notificationSchema.index({ student_id: 1, read: 1, createdAt: -1 });
notificationSchema.index({ parent_id: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);

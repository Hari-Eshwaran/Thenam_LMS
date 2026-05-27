import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    transaction_id: { type: String, required: false, index: true },
    date: { type: Date, required: true },
  },
  {
    collection: "payments",
    timestamps: true,
  },
);

paymentSchema.index({ student_id: 1, date: -1 });
paymentSchema.index({ transaction_id: 1 }, { sparse: true });

export const Payment = mongoose.model("Payment", paymentSchema);

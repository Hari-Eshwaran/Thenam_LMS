import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, unique: true, index: true },
    total_fee: { type: Number, required: true },
    paid: { type: Number, required: true },
    balance: { type: Number, required: true },
  },
  {
    collection: "fees",
    timestamps: true,
  },
);

feesSchema.index({ balance: 1, student_id: 1 });

export const Fees = mongoose.model("Fees", feesSchema);

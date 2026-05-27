import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment_id: { type: String, required: true, index: true },
    student_id: { type: String, required: true, index: true },
    marks: { type: Number, required: true },
  },
  {
    collection: "submissions",
    timestamps: true,
  },
);

submissionSchema.index({ assignment_id: 1, student_id: 1 }, { unique: true });

export const Submission = mongoose.model("Submission", submissionSchema);

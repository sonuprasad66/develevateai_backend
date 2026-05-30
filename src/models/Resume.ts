import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  fileUrl: string;
  extractedText: string;
  atsScore: number;
  aiFeedback: string[];
}

const resumeSchema = new Schema<IResume>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    extractedText: { type: String, default: "" },
    atsScore: { type: Number, default: 0 },
    aiFeedback: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Resume = mongoose.model<IResume>("Resume", resumeSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IInterviewNote extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  feedback: string;
}

const interviewNoteSchema = new Schema<IInterviewNote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    feedback: { type: String, default: "" },
  },
  { timestamps: true }
);

export const InterviewNote = mongoose.model<IInterviewNote>(
  "InterviewNote",
  interviewNoteSchema
);

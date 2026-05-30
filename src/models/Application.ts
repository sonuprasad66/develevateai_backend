import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  salary?: number;
  status: "Applied" | "Interview" | "Rejected" | "Offer" | "Ghosted";
  appliedDate?: Date;
  jobUrl?: string;
  notes?: string;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    salary: Number,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Rejected", "Offer", "Ghosted"],
      default: "Applied",
    },
    appliedDate: Date,
    jobUrl: String,
    notes: String,
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);

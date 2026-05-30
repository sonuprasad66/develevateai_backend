import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: "planned" | "in-progress" | "completed";
  githubUrl?: string;
  liveUrl?: string;
  aiGenerated: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },
    githubUrl: String,
    liveUrl: String,
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);

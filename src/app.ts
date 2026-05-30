import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import projectRoutes from "./routes/project.routes";
import applicationRoutes from "./routes/application.routes";
import interviewRoutes from "./routes/interview.routes";
import insightsRoutes from "./routes/insights.routes";
import settingsRoutes from "./routes/settings.routes";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { sanitizeRequest } from "./middleware/sanitize";

export const app = express();

app.use(
  cors({
    origin: [
      env.clientUrl,
      "https://stupendous-hamster-a91124.netlify.app/login",
      "https://develevateai.sonuprasad.com",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interview-prep", interviewRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/settings", settingsRoutes);

app.use(notFound);
app.use(errorHandler);

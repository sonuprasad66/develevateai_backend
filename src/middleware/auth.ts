import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../types";

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as {
      userId: string;
      email: string;
      role?: "user" | "admin";
    };
    req.user = payload;
    next();
  } catch (_error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

import { NextFunction, Response } from "express";
import { ApiError } from "../utils/apiError";
import { AuthRequest } from "../types";

export const requireRole = (roles: Array<"user" | "admin">) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const role = req.user?.role || "user";
    if (!roles.includes(role)) {
      return next(new ApiError(403, "Forbidden"));
    }
    next();
  };
};

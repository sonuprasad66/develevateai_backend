import { Request } from "express";

export interface AuthUser {
  userId: string;
  email: string;
  role?: "user" | "admin";
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

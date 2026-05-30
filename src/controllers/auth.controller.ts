import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const payload = { userId: user._id.toString(), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res
    .cookie("accessToken", accessToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 })
    .cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 * 7 })
    .status(201)
    .json(
      apiResponse("Signup successful", {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const payload = { userId: user._id.toString(), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res
    .cookie("accessToken", accessToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 })
    .cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 * 7 })
    .json(
      apiResponse("Login successful", {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    );
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as Request & { user?: { userId: string } }).user?.userId;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(apiResponse("User profile", user));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new ApiError(401, "Missing refresh token");
  }

  const jwt = await import("jsonwebtoken");
  const { env } = await import("../config/env");
  const payload = jwt.verify(token, env.jwtRefreshSecret) as {
    userId: string;
    email: string;
    role?: "user" | "admin";
  };

  const accessToken = signAccessToken(payload);
  res.cookie("accessToken", accessToken, {
    ...cookieBase,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json(apiResponse("Token refreshed"));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", cookieBase);
  res.clearCookie("refreshToken", cookieBase);
  res.json(apiResponse("Logged out"));
});

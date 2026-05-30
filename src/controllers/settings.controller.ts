import bcrypt from "bcryptjs";
import { Response } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../types";
import { ApiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user?.userId,
    {
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    },
    { new: true }
  ).select("-password");

  res.json(apiResponse("Profile updated", user));
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json(apiResponse("Password updated"));
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndDelete(req.user?.userId);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json(apiResponse("Account deleted"));
});

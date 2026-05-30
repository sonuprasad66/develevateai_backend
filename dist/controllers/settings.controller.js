"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.updateProfile = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.User.findByIdAndUpdate(req.user?.userId, {
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
    }, { new: true }).select("-password");
    res.json((0, apiResponse_1.apiResponse)("Profile updated", user));
});
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User_1.User.findById(req.user?.userId);
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const valid = await bcryptjs_1.default.compare(currentPassword, user.password);
    if (!valid) {
        throw new apiError_1.ApiError(401, "Current password is incorrect");
    }
    user.password = await bcryptjs_1.default.hash(newPassword, 12);
    await user.save();
    res.json((0, apiResponse_1.apiResponse)("Password updated"));
});
exports.deleteAccount = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await User_1.User.findByIdAndDelete(req.user?.userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json((0, apiResponse_1.apiResponse)("Account deleted"));
});

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.me = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_1 = require("../utils/jwt");
const cookieBase = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
};
exports.signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { fullName, email, password } = req.body;
    const exists = await User_1.User.findOne({ email });
    if (exists) {
        throw new apiError_1.ApiError(409, "Email already in use");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await User_1.User.create({
        fullName,
        email,
        password: hashedPassword,
    });
    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = (0, jwt_1.signAccessToken)(payload);
    const refreshToken = (0, jwt_1.signRefreshToken)(payload);
    res
        .cookie("accessToken", accessToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 })
        .cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 * 7 })
        .status(201)
        .json((0, apiResponse_1.apiResponse)("Signup successful", {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        },
    }));
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user) {
        throw new apiError_1.ApiError(401, "Invalid credentials");
    }
    const isValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isValid) {
        throw new apiError_1.ApiError(401, "Invalid credentials");
    }
    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = (0, jwt_1.signAccessToken)(payload);
    const refreshToken = (0, jwt_1.signRefreshToken)(payload);
    res
        .cookie("accessToken", accessToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 })
        .cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: 1000 * 60 * 60 * 24 * 7 })
        .json((0, apiResponse_1.apiResponse)("Login successful", {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        },
    }));
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.userId;
    const user = await User_1.User.findById(userId).select("-password");
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    res.json((0, apiResponse_1.apiResponse)("User profile", user));
});
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        throw new apiError_1.ApiError(401, "Missing refresh token");
    }
    const jwt = await Promise.resolve().then(() => __importStar(require("jsonwebtoken")));
    const { env } = await Promise.resolve().then(() => __importStar(require("../config/env")));
    const payload = jwt.verify(token, env.jwtRefreshSecret);
    const accessToken = (0, jwt_1.signAccessToken)(payload);
    res.cookie("accessToken", accessToken, {
        ...cookieBase,
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.json((0, apiResponse_1.apiResponse)("Token refreshed"));
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.clearCookie("accessToken", cookieBase);
    res.clearCookie("refreshToken", cookieBase);
    res.json((0, apiResponse_1.apiResponse)("Logged out"));
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const apiError_1 = require("../utils/apiError");
const requireAuth = (req, _res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
        return next(new apiError_1.ApiError(401, "Unauthorized"));
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtAccessSecret);
        req.user = payload;
        next();
    }
    catch (_error) {
        next(new apiError_1.ApiError(401, "Invalid or expired token"));
    }
};
exports.requireAuth = requireAuth;

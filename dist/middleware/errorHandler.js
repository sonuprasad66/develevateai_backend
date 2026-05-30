"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
const notFound = (_req, _res, next) => {
    next(new apiError_1.ApiError(404, "Route not found"));
};
exports.notFound = notFound;
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues,
        });
    }
    if (err instanceof apiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
};
exports.errorHandler = errorHandler;

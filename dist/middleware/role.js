"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const apiError_1 = require("../utils/apiError");
const requireRole = (roles) => {
    return (req, _res, next) => {
        const role = req.user?.role || "user";
        if (!roles.includes(role)) {
            return next(new apiError_1.ApiError(403, "Forbidden"));
        }
        next();
    };
};
exports.requireRole = requireRole;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequest = void 0;
const clean = (value) => {
    if (Array.isArray(value)) {
        return value.map(clean);
    }
    if (value && typeof value === "object") {
        return Object.entries(value).reduce((acc, [key, val]) => {
            if (key.startsWith("$") || key.includes(".")) {
                return acc;
            }
            acc[key] = clean(val);
            return acc;
        }, {});
    }
    return value;
};
const sanitizeRequest = (req, _res, next) => {
    req.body = clean(req.body);
    next();
};
exports.sanitizeRequest = sanitizeRequest;

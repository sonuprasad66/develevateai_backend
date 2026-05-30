"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getApplications = exports.createApplication = void 0;
const Application_1 = require("../models/Application");
const apiError_1 = require("../utils/apiError");
const apiResponse_1 = require("../utils/apiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createApplication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const application = await Application_1.Application.create({
        userId: req.user?.userId,
        ...req.body,
    });
    res.status(201).json((0, apiResponse_1.apiResponse)("Application created", application));
});
exports.getApplications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const status = req.query.status;
    const search = req.query.search;
    const query = { userId: req.user?.userId };
    if (status)
        query.status = status;
    if (search) {
        query.$or = [
            { company: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
        ];
    }
    const [items, total] = await Promise.all([
        Application_1.Application.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Application_1.Application.countDocuments(query),
    ]);
    res.json((0, apiResponse_1.apiResponse)("Applications fetched", {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    }));
});
exports.updateApplication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const application = await Application_1.Application.findOneAndUpdate({ _id: req.params.id, userId: req.user?.userId }, req.body, { new: true });
    if (!application) {
        throw new apiError_1.ApiError(404, "Application not found");
    }
    res.json((0, apiResponse_1.apiResponse)("Application updated", application));
});
exports.deleteApplication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const application = await Application_1.Application.findOneAndDelete({
        _id: req.params.id,
        userId: req.user?.userId,
    });
    if (!application) {
        throw new apiError_1.ApiError(404, "Application not found");
    }
    res.json((0, apiResponse_1.apiResponse)("Application deleted"));
});

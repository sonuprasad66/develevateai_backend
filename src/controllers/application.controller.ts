import { Response } from "express";
import { Application } from "../models/Application";
import { AuthRequest } from "../types";
import { ApiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const application = await Application.create({
    userId: req.user?.userId,
    ...req.body,
  });

  res.status(201).json(apiResponse("Application created", application));
});

export const getApplications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;

  const query: Record<string, unknown> = { userId: req.user?.userId };
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Application.countDocuments(query),
  ]);

  res.json(
    apiResponse("Applications fetched", {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  );
});

export const updateApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const application = await Application.findOneAndUpdate(
    { _id: req.params.id, userId: req.user?.userId },
    req.body,
    { new: true }
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  res.json(apiResponse("Application updated", application));
});

export const deleteApplication = asyncHandler(async (req: AuthRequest, res: Response) => {
  const application = await Application.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?.userId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  res.json(apiResponse("Application deleted"));
});

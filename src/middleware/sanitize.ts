import { NextFunction, Request, Response } from "express";

const clean = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(clean);
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
      (acc, [key, val]) => {
        if (key.startsWith("$") || key.includes(".")) {
          return acc;
        }
        acc[key] = clean(val);
        return acc;
      },
      {}
    );
  }

  return value;
};

export const sanitizeRequest = (req: Request, _res: Response, next: NextFunction) => {
  req.body = clean(req.body) as typeof req.body;
  next();
};

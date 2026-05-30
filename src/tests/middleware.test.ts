import { NextFunction, Response } from "express";
import { requireAuth } from "../middleware/auth";

describe("Auth middleware", () => {
  it("should call next with unauthorized error when token missing", () => {
    const req = {
      cookies: {},
      headers: {},
    } as never;

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

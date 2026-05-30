import request from "supertest";
import { app } from "../app";

describe("Auth API", () => {
  it("should reject invalid signup payload", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      fullName: "A",
      email: "bad-email",
      password: "123",
      confirmPassword: "456",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should reject invalid login payload", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should block unauthenticated access to /me", async () => {
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(401);
  });
});

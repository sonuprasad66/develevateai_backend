"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
describe("Auth API", () => {
    it("should reject invalid signup payload", async () => {
        const response = await (0, supertest_1.default)(app_1.app).post("/api/auth/signup").send({
            fullName: "A",
            email: "bad-email",
            password: "123",
            confirmPassword: "456",
        });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
    it("should reject invalid login payload", async () => {
        const response = await (0, supertest_1.default)(app_1.app).post("/api/auth/login").send({
            email: "",
            password: "",
        });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
    it("should block unauthenticated access to /me", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/auth/me");
        expect(response.status).toBe(401);
    });
});

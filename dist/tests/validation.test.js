"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_validation_1 = require("../validations/auth.validation");
describe("Validation schemas", () => {
    it("should reject weak password", () => {
        const result = auth_validation_1.signupSchema.safeParse({
            fullName: "John Doe",
            email: "john@doe.com",
            password: "weak",
            confirmPassword: "weak",
        });
        expect(result.success).toBe(false);
    });
    it("should reject mismatched passwords", () => {
        const result = auth_validation_1.signupSchema.safeParse({
            fullName: "John Doe",
            email: "john@doe.com",
            password: "StrongPass1",
            confirmPassword: "StrongPass2",
        });
        expect(result.success).toBe(false);
    });
    it("should accept valid login payload", () => {
        const result = auth_validation_1.loginSchema.safeParse({
            email: "john@doe.com",
            password: "StrongPass1",
        });
        expect(result.success).toBe(true);
    });
});

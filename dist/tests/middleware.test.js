"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
describe("Auth middleware", () => {
    it("should call next with unauthorized error when token missing", () => {
        const req = {
            cookies: {},
            headers: {},
        };
        const res = {};
        const next = jest.fn();
        (0, auth_1.requireAuth)(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

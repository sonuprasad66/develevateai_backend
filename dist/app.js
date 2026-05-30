"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const insights_routes_1 = __importDefault(require("./routes/insights.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const sanitize_1 = require("./middleware/sanitize");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_1.env.clientUrl,
    credentials: true,
}));
exports.app.use((0, helmet_1.default)());
exports.app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
}));
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(sanitize_1.sanitizeRequest);
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
exports.app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Server is healthy" });
});
exports.app.use("/api/auth", auth_routes_1.default);
exports.app.use("/api/resumes", resume_routes_1.default);
exports.app.use("/api/projects", project_routes_1.default);
exports.app.use("/api/applications", application_routes_1.default);
exports.app.use("/api/interview-prep", interview_routes_1.default);
exports.app.use("/api/insights", insights_routes_1.default);
exports.app.use("/api/settings", settings_routes_1.default);
exports.app.use(errorHandler_1.notFound);
exports.app.use(errorHandler_1.errorHandler);

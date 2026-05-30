"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromResume = void 0;
const fs_1 = __importDefault(require("fs"));
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = require("pdf-parse");
const extractTextFromResume = async (filePath) => {
    const fileBuffer = fs_1.default.readFileSync(filePath);
    if (filePath.endsWith(".pdf")) {
        const parser = new pdf_parse_1.PDFParse({ data: fileBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text || "";
    }
    if (filePath.endsWith(".docx")) {
        const result = await mammoth_1.default.extractRawText({ buffer: fileBuffer });
        return result.value || "";
    }
    return "";
};
exports.extractTextFromResume = extractTextFromResume;

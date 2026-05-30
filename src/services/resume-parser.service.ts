import fs from "fs";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export const extractTextFromResume = async (filePath: string): Promise<string> => {
  const fileBuffer = fs.readFileSync(filePath);

  if (filePath.endsWith(".pdf")) {
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text || "";
  }

  if (filePath.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value || "";
  }

  return "";
};

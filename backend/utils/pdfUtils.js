// utils/pdfUtils.js
import { fromBuffer } from "pdf2pic";

export async function pdfToImages(pdfBuffer) {
  const convert = fromBuffer(pdfBuffer, {
    density: 200, // DPI
    saveFilename: "page",
    savePath: "/tmp",
    format: "png",
    width: 2000,
    height: 2000
  });

  const results = await convert.bulk(-1); // Convert all pages

  // Convert to Gemini format
  return results.map((result) => ({
    inlineData: {
      data: result.buffer.toString("base64"),
      mimeType: "image/png",
    },
  }));
}

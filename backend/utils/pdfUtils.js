// utils/pdfUtils.js
import { pdfToPng } from "pdf-to-png-converter";

export async function pdfToImages(pdfBuffer) {
  const pngPages = await pdfToPng(pdfBuffer, {
    viewportScale: 2, // quality
  });

  // Gemini ko jo format chahiye
  return pngPages.map((page) => ({
    inlineData: {
      data: page.content.toString("base64"),
      mimeType: "image/png",
    },
  }));
}

import { getGeminiResponse } from "../services/geminiService.js";
import { pdfToImages } from "../utils/pdfUtils.js"; // ✅ ye naya helper banayenge

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;

    if (!message && !file) {
      return res.status(400).json({ error: "Message or File is required" });
    }

    let botReply;

    if (file) {
      if (file.mimetype === "application/pdf") {
        // ✅ convert PDF -> images
        const images = await pdfToImages(file.buffer);

        if (images.length > 16) {
          return res.json({
            success: true,
            userMessage: message,
            botReply:
              "The document is too long. Please consult a doctor directly for such detailed records.",
            file: file.originalname,
          });
        }

        // Gemini ko multiple images bhejna
        botReply = await getGeminiResponse(message || "", null, null, images);
      } else {
        // Agar image hai
        botReply = await getGeminiResponse(message || "", file.buffer, file.mimetype);
      }
    } else {
      // Sirf text
      botReply = await getGeminiResponse(message);
    }

    return res.json({
      success: true,
      userMessage: message,
      botReply,
      file: file ? file.originalname : null,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// controllers/chatController.js
import { getGeminiResponse } from "../services/geminiService.js";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file; // multer se ayega if image uploaded

    // agar text bhi nahi hai aur image bhi nahi hai
    if (!message && !file) {
      return res.status(400).json({ error: "Message or Image is required" });
    }

    let botReply;

    if (file) {
      // Agar image bhi hai, Gemini ko text + image bhejo
      const mimeType = file.mimetype;
      const buffer = file.buffer;
      botReply = await getGeminiResponse(message || "", buffer, mimeType);
    } else {
      // Sirf text bhejna hai
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

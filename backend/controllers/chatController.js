import { getGeminiResponse } from "../services/geminiService.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Gemini se reply
    const reply = await getGeminiResponse(message);

    // Client ko bhejna
    return res.json({
      success: true,
      userMessage: message,
      botReply: reply,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({ error: "Something idk man" });
  }
};

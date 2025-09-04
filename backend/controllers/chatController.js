import { getGeminiResponse } from "../services/geminiService.js";
import { pdfToImages } from "../utils/pdfUtils.js";
import User from "../models/User.js";

export const handleChat = async (req, res) => {
  try {
    const { message, phone } = req.body;  // <-- phone added
    const file = req.file;

    if (!message && !file) {
      return res.status(400).json({ error: "Message or File is required" });
    }

    // ✅ fetch user by phone to get location
    const user = await User.findOne({ phone });
    const locationInfo = user?.location
      ? `User is at ${user.location.address} (lat: ${user.location.latitude}, long: ${user.location.longitude}).`
      : "User location not provided.";

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

        // Gemini ko multiple images bhejna with location
        botReply = await getGeminiResponse(
          `${message || ""}\n\nLocation Context: ${locationInfo}`, 
          null, 
          null, 
          images
        );
      } else {
        // Agar image hai with location
        botReply = await getGeminiResponse(
          `${message || ""}\n\nLocation Context: ${locationInfo}`, 
          file.buffer, 
          file.mimetype
        );
      }
    } else {
      // Sirf text with location
      botReply = await getGeminiResponse(`${message}\n\nLocation Context: ${locationInfo}`);
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

import { getGeminiResponse } from "../services/geminiService.js";
import { pdfToImages } from "../utils/pdfUtils.js";
import User from "../models/User.js";

// Phone number formatting function
const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }
  return cleaned;
};

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const file = req.file;
    const userId = req.user.id; // Get user ID from JWT middleware

    if (!message && !file) {
      return res.status(400).json({ error: "Message or File is required" });
    }

    // Fetch user by ID to get location
    const user = await User.findById(userId);
    
    const locationInfo = user?.location
      ? `User is at ${user.location.address} (lat: ${user.location.latitude}, long: ${user.location.longitude}).`
      : "User location not provided.";

    let botReply;

    if (file) {
      if (file.mimetype === "application/pdf") {
        // Convert PDF to images
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

        botReply = await getGeminiResponse(
          message || "",
          null,
          null,
          images,
          locationInfo
        );
      } else {
        // Single image
        botReply = await getGeminiResponse(
          message || "", 
          file.buffer, 
          file.mimetype, 
          [],
          locationInfo
        );
      }
    } else {
      // Text only
      botReply = await getGeminiResponse(
        message || "",
        null,
        null,
        [],
        locationInfo
      );
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

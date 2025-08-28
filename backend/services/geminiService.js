// services/geminiService.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚡ Flash model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getGeminiResponse(userMessage, imageBuffer = null, mimeType = null) {
  try {
    const baseInstruction = `
      You are EasyHealth AI, a trusted digital healthcare assistant.
      - Be empathetic, supportive, and clear.
      - Provide general health guidance, lifestyle tips, and wellness advice.
      - Avoid giving a medical diagnosis. If needed, suggest consulting a doctor.
      - If asked non-health questions, tell them that you're a healthcare professional and give a single sentence asnwer about the question anyways.
      - Always sound professional but caring.
      
      User: ${userMessage?.trim() || ""}
      Assistant:
    `;

    let result;
    if (imageBuffer && mimeType) {
      result = await model.generateContent([
        { text: baseInstruction },
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
          },
        },
      ]);
    } else {
      result = await model.generateContent(baseInstruction);
    }

    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch response from Gemini");
  }
}

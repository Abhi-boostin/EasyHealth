// services/geminiService.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function getGeminiResponse(
  userMessage,
  imageBuffer = null,
  mimeType = null,
  multipleImages = [],
  locationInfo = "User location not provided"
) {
  try {
    const baseInstruction = `You are EasyHealth AI, a trusted digital healthcare assistant.

**Your Role:**
- Analyze user's medical files (blood reports, lab results, scans) and explain findings clearly.
- Highlight any abnormal values and explain what they might indicate.
- Translate complex medical terminology into simple everyday language.
- Be empathetic, clear, and supportive.

**User Location Information (if available):**
${locationInfo}

**Important Boundaries:**
- Always remind: "This helps you understand your medical info but is not a replacement for professional advice."
- For urgent values: "This appears to need immediate medical attention — please contact a doctor or emergency services right away."

**Output Format:**
- First explain the medical results in simple terms.
- Then list 2-3 nearest hospitals/clinics based on the user's location with doctor & timings info.
- Use bullets or numbered lists for clarity.

**User Medical Message:** ${userMessage?.trim() || ""}`;

    let contents;

    if (multipleImages.length > 0) {
      contents = [baseInstruction, ...multipleImages];
    } else if (imageBuffer && mimeType) {
      contents = [
        baseInstruction,
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType,
          },
        },
      ];
    } else {
      contents = baseInstruction;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    console.error("Error stack:", error.stack);
    throw new Error(`Gemini API failed: ${error.message}`);
  }
}

export async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API...");
    console.log("API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say 'Hello, EasyHealth is working!' in one sentence."
    });
    
    console.log("✅ Gemini API Test Success:", response.text);
    return { success: true, response: response.text };
  } catch (error) {
    console.error("❌ Gemini API Test Failed:", error.message);
    return { success: false, error: error.message };
  }
}

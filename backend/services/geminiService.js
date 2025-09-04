// services/geminiService.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ⚡ Flash model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * userMessage: string - user's text input
 * imageBuffer: Buffer - single image file
 * mimeType: string - MIME type of single image
 * multipleImages: Array - for PDF pages or multiple image uploads [{ inlineData: { data, mimeType } }]
 * locationInfo: string - formatted user location to help suggest nearby hospitals
 */
export async function getGeminiResponse(
  userMessage,
  imageBuffer = null,
  mimeType = null,
  multipleImages = [],
  locationInfo = "User location not provided"
) {
  try {
    // Combine base instruction with location info
    const baseInstruction = `
You are EasyHealth AI, a trusted digital healthcare assistant.

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
- Example:

Analysis:
- Your blood sugar is high, which may indicate diabetes risk.
- Your cholesterol levels are slightly elevated.

Nearby Medical Assistance:
1. Sunshine Hospital
   - Doctor: Dr. Rahul Sharma (Endocrinologist)
   - Timing: Mon-Fri 10am-5pm
   - Contact: +91 9876543210
   - Address: Muradnagar, Uttar Pradesh
2. City Care Clinic
   - Doctor: Dr. Priya Singh (General Physician)
   - Timing: Mon-Sat 9am-6pm
   - Contact: +91 9123456780
   - Address: Muradnagar, Uttar Pradesh

**User Medical Message:** ${userMessage?.trim() || ""}

Assistant:
`;

    let result;

    if (multipleImages.length > 0) {
      // PDF pages or multiple images
      result = await model.generateContent([
        { text: baseInstruction },
        ...multipleImages,
      ]);
    } else if (imageBuffer && mimeType) {
      // Single image
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
      // Text only
      result = await model.generateContent(baseInstruction);
    }

    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch response from Gemini");
  }
}

// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (userMessage) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const easyHealthPrompt = `
You are EasyHealth, a helpful healthcare assistant.
Your main job is to provide **health-care tips and guidance** using trusted medical knowledge.
If the user asks about **non-health-care topics**, politely say:
“I am a healthcare professional bot, but I can still answer briefly.”
Keep non-health-care replies short and concise.
Always stay professional, empathetic, and clear in healthcare advice.
User: ${userMessage}
Assistant:
    `.trim();
    const result = await model.generateContent(easyHealthPrompt);

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch response from Gemini");
  }
};

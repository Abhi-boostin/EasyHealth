// services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (userMessage) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(userMessage);
    return result.response.text();
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch response from Gemini");
  }
};

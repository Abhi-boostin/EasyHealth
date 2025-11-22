import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log("🔍 Listing available Gemini models...\n");
console.log("API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
console.log("API Key (first 10 chars):", process.env.GEMINI_API_KEY?.substring(0, 10));

try {
  const models = await genAI.listModels();
  console.log("\n✅ Available models:");
  for await (const model of models) {
    console.log(`- ${model.name}`);
    console.log(`  Display Name: ${model.displayName}`);
    console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(", ")}`);
    console.log("");
  }
} catch (error) {
  console.error("\n❌ Error listing models:");
  console.error("Message:", error.message);
  console.error("\nThis usually means:");
  console.error("1. Invalid API key");
  console.error("2. API key doesn't have proper permissions");
  console.error("3. Billing not enabled on Google Cloud project");
}

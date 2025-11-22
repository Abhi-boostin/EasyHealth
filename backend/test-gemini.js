import { testGeminiAPI } from "./services/geminiService.js";

console.log("🧪 Testing Gemini API Connection...\n");

testGeminiAPI()
  .then((result) => {
    if (result.success) {
      console.log("\n✅ Test passed!");
      console.log("Response:", result.response);
      process.exit(0);
    } else {
      console.log("\n❌ Test failed!");
      console.log("Error:", result.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("\n❌ Unexpected error:", error);
    process.exit(1);
  });

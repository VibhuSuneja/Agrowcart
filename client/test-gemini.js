const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("API Key length:", apiKey?.length);
        if(!apiKey) {
            console.error("No API key found in .env.local");
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (e) {
        console.error("Error during test:", e);
    }
}

test();

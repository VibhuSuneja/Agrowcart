import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Best model for massive requests (2.5 Flash has higher throughput and stability)
export const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
}, { apiVersion: "v1" });

// Apply shared configuration for the app
model.safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }
];

model.generationConfig = {
    maxOutputTokens: 4096, // Increased for full legal documents
    temperature: 0.1, // Lower temperature for more consistent legal drafting
};


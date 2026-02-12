import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const limit = 5;

        // Get timestamps for this IP, defaulting to empty array
        const timestamps = rateLimitMap.get(ip) || [];

        // Filter out timestamps older than the window
        const validTimestamps = timestamps.filter(t => now - t < windowMs);

        if (validTimestamps.length >= limit) {
            return NextResponse.json(
                { reply: "Whoa there, partner! 🚜 You're sending messages faster than a tractor in high gear. Please wait a moment." },
                { status: 429 }
            );
        }

        // Add current timestamp and update map
        validTimestamps.push(now);
        rateLimitMap.set(ip, validTimestamps);

        // Cleanup old entries periodically (optional, but good for memory)
        if (rateLimitMap.size > 1000) {
            for (const [key, val] of rateLimitMap.entries()) {
                if (val.every(t => now - t > windowMs)) {
                    rateLimitMap.delete(key);
                }
            }
        }

        const { message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            throw new Error("API Key missing");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the latest flagship model for better reliability
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are Agrowcart AI, the official agricultural intelligence for Agrowcart platform.
        
User identifies as someone interested in organic millets.
User Message: "${message}"

Your Goal: Provide a friendly, expert response (max 2-3 sentences).
Platform Values:
- Dedicated to the "International Year of Millets" initiative.
- Direct Farmer-to-Consumer / SHG-to-Corporate connectivity.
- Focus: Foxtail, Ragi, Bajra, Jowar, and other ancient grains.
- Sustainability: Low water usage, gluten-free, and high nutrition.

Instructions:
- If asked about prices or stock: Refer them to the Marketplace page.
- If asked about an order: Direct them to 'My Orders' in their dashboard.
- If asked about health benefits: Highlight high fiber and mineral content.
- Formatting: Use **bold** for key terms and markdown lists for multiple items.
- Tone: Professional, warm, and tech-savvy. Use 1-2 green/farm emojis.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Fallback if text is empty
        const reply = text || "I am currently syncing my knowledge base with the latest harvest data. How else can I assist you? 🌾";

        return NextResponse.json({ reply }, { status: 200 });

    } catch (error: any) {
        console.error("ChatBot API Error:", error);
        // Fallback message for UI continuity
        return NextResponse.json(
            { reply: "Our digital farmer is taking a quick break to check the harvest! 🌿 Please try asking again in a moment, or browse our fresh millets in the marketplace." },
            { status: 200 }
        );
    }
}

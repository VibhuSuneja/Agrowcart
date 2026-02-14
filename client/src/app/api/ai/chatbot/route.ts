import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
// import Groq from "groq-sdk"; // Removed Groq


const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const limit = 10; // Increased limit for faster interaction

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

        // Cleanup old entries periodically
        if (rateLimitMap.size > 1000) {
            for (const [key, val] of rateLimitMap.entries()) {
                if (val.every(t => now - t > windowMs)) {
                    rateLimitMap.delete(key);
                }
            }
        }

        const { message } = await req.json();





        const systemPrompt = `You are Agrowcart AI, the official agricultural intelligence for the Agrowcart platform.
        
User identifies as someone interested in organic millets.
Your Goal: Provide a friendly, expert response (max 2 sentences).
Platform Values:
- Dedicated to the "International Year of Millets".
- Direct Farmer-to-Consumer connectivity.
- Focus: Foxtail, Ragi, Bajra, Jowar.
- Sustainability & Nutrition.

Instructions:
- If asked about prices: Refer to Marketplace.
- If asked about orders: Direct to Dashboard.
- Formatting: Use **bold** for key terms.
- Tone: Professional, warm, tech-savvy. Use 1-2 green emojis.`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Agrowcart AI, ready to assist with organic millets, orders, and sustainable farming questions." }],
                }
            ],
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const reply = response.text() || "I'm checking the soil moisture levels... how else can I help? 🌾";



        return NextResponse.json({ reply }, { status: 200 });

    } catch (error: any) {
        console.error("ChatBot API Error (Gemini):", error);
        return NextResponse.json(
            { reply: "Our digital farmer is taking a quick break to check the harvest! 🌿 Please try asking again in a moment." },
            { status: 200 }
        );
    }
}

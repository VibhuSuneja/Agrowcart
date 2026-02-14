import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const rateLimitMap = new Map<string, number[]>();

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const limit = 10;

        // Get timestamps for this IP
        const timestamps = rateLimitMap.get(ip) || [];
        const validTimestamps = timestamps.filter(t => now - t < windowMs);

        if (validTimestamps.length >= limit) {
            return NextResponse.json(
                { reply: "Whoa there, partner! 🚜 You're sending messages faster than a tractor in high gear. Please wait a moment." },
                { status: 429 }
            );
        }

        validTimestamps.push(now);
        rateLimitMap.set(ip, validTimestamps);

        if (rateLimitMap.size > 1000) {
            for (const [key, val] of rateLimitMap.entries()) {
                if (val.every(t => now - t > windowMs)) {
                    rateLimitMap.delete(key);
                }
            }
        }

        const { message } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY is missing.");
            return NextResponse.json(
                { reply: "Our lightning-fast AI engine is currently fueling up! ⚡ Please ensure GROQ_API_KEY is configured." },
                { status: 200 }
            );
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
            stream: false,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I'm checking the soil moisture levels... how else can I help? 🌾";

        return NextResponse.json({ reply }, { status: 200 });

    } catch (error: any) {
        console.error("ChatBot API Error (Groq):", error);
        return NextResponse.json(
            { reply: "Our digital farmer is taking a quick break to check the harvest! 🌿 Please try asking again in a moment." },
            { status: 200 }
        );
    }
}

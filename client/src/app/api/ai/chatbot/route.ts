import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            throw new Error("API Key missing");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using a stable model alias
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are AgrowCart AI, a helpful assistant for an organic millet delivery platform.
        
User Message: "${message}"

Your Goal: Provide a helpful, concise response (max 2-3 sentences).
Context:
- AgrowCart connects farmers directly to consumers.
- We sell Millets (Foxtail, Ragi, etc.), Pulses, and Value-added products.
- We track product journey via blockchain for transparency.
- We support farmers with fair prices.

If the user asks about specific stock, say you can check the marketplace page.
If the user asks about an order, ask them to check 'My Orders'.
Be friendly and use 1-2 emojis.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Fallback if text is empty
        const reply = text || "I'm currently updating my knowledge base. Please try exploring our marketplace! 🌿";

        return NextResponse.json({ reply }, { status: 200 });

    } catch (error: any) {
        console.error("ChatBot API Error:", error);
        // Fallback message for UI continuity
        return NextResponse.json(
            { reply: "I'm taking a short hydration break! 🌿 In the meantime, you can find our best millets in the marketplace or check your profile." },
            { status: 200 }
        );
    }
}

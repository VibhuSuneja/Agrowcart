import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        const prompt = `You are SnapCart AI, a helpful assistant for an organic millet delivery platform.
        
User Message: "${message}"

Your Goal: Provide a helpful, concise response (max 2-3 sentences).
Context:
- SnapCart connects farmers directly to consumers.
- We sell Millets (Foxtail, Ragi, etc.), Pulses, and Value-added products.
- We track product journey via blockchain for transparency.
- We support farmers with fair prices.

If the user asks about specific stock, say you can check the marketplace page.
If the user asks about an order, ask them to check 'My Orders'.
Be friendly and use 1-2 emojis.`;

        // Using Gemini API (assuming key is same as other endpoints)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm currently updating my knowledge base. Please try again in a moment.";

        return NextResponse.json({ reply }, { status: 200 });

    } catch (error) {
        console.error("ChatBot API Error:", error);
        return NextResponse.json(
            { reply: "I'm having a bit of trouble connecting right now. 🌿" },
            { status: 500 }
        );
    }
}

import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// HIGH-QUALITY STATIC FALLBACKS (Zero-Cost, Future-Ready)
const FALLBACK_SUGGESTIONS = {
    user: [
        "Where are you exactly? 📍",
        "Please leave it at the gate. 🚪",
        "I'm coming down now. 🏃‍♂️",
        "Thank you for the delivery! 🙏",
        "Is my order coming soon? ⏳"
    ],
    delivery_boy: [
        "I have arrived at your location. 📍",
        "I am on my way. 🛵",
        "Please provide the OTP. 🔢",
        "I'm waiting at the main gate. 🚪",
        "Thank you, have a great day! 😊"
    ]
};

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { message, role } = await req.json()

        // Default role to user if not provided
        const userRole = role === "delivery_boy" ? "delivery_boy" : "user";

        // Logic-based Quick Path: If no message, give high-quality starters immediately
        // This saves API credits for every "New Chat" initiated.
        if (!message || message.trim() === "") {
            return NextResponse.json(
                FALLBACK_SUGGESTIONS[userRole].slice(0, 3),
                { status: 200 }
            );
        }

        const prompt = `You are a professional delivery assistant chatbot for Agrowcart.

Context:
- Role of person receiving suggestions: ${userRole}
- Last message received: "${message}"

Task:
Generate exactly 3 short, helpful, and natural reply suggestions.
👉 Role: ${userRole}

Rules:
- Keep replies short (max 6 words).
- Use max one emoji per reply.
- Return ONLY the suggestions as a comma-separated list.
- Example output: Yes, please leave it at the gate. 🚪, I am coming down now. 🏃‍♂️, Thank you so much! 🙏`

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "contents": [{ "parts": [{ "text": prompt }] }]
                }),
                // Timeout to ensure app doesn't hang if API is slow
                signal: AbortSignal.timeout(5000)
            })

            if (response.ok) {
                const data = await response.json()
                const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

                const suggestions = replyText
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0)
                    .slice(0, 3);

                if (suggestions.length > 0) {
                    return NextResponse.json(suggestions, { status: 200 });
                }
            }
        } catch (apiError) {
            console.error("Gemini API Call Failed:", apiError);
            // Don't throw, just fall through to the static suggestions
        }

        // STATIC FALLBACK (Triggered if API fails or limit reached)
        console.log(`Serving static fallback for ${userRole}`);
        return NextResponse.json(
            FALLBACK_SUGGESTIONS[userRole].slice(0, 3),
            { status: 200 }
        );

    } catch (error) {
        console.error("AI Suggestions Route Error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

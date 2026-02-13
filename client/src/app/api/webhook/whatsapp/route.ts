import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Verify Webhook (Required by Meta)
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "agrowcart_secret";

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse("Forbidden", { status: 403 });
        }
    }
    return new NextResponse("Bad Request", { status: 400 });
}

import crypto from "crypto";

// Handle Incoming Messages
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);

        // 1. Cybersecurity Check: Signature Verification
        // Meta sends HMAC SHA256 of the body using your App Secret
        const signature = req.headers.get("x-hub-signature-256");
        const appSecret = process.env.WHATSAPP_APP_SECRET;

        if (appSecret) {
            if (!signature) {
                return new NextResponse("Signature Missing", { status: 401 });
            }
            const expectedSignature = crypto
                .createHmac("sha256", appSecret)
                .update(rawBody)
                .digest("hex");

            if (signature !== `sha256=${expectedSignature}`) {
                return new NextResponse("Invalid Signature", { status: 401 });
            }
        } else {
            console.warn("⚠️ WHATSAPP_APP_SECRET missing. Bot is vulnerable to spoofing.");
        }

        // Check if this is a message from WhatsApp
        if (body.object === "whatsapp_business_account") {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const message = value?.messages?.[0];

            if (message) {
                const from = message.from; // Sender's phone number
                const type = message.type;

                // 1. Handle Text Messages
                if (type === "text") {
                    const text = message.text.body;
                    await sendWhatsAppMessage(from, `👋 Welcome to AgrowCart! \n\nI am your AI Assistant. You can:\n1. 📸 Send a photo of your crop to sell it.\n2. 🏥 Send a photo of a sick leaf for a diagnosis.`);
                }

                // 2. Handle Image Messages (Crop Upload)
                if (type === "image") {
                    const imageId = message.image.id;
                    // Get Image URL from Meta
                    const imageUrl = await getWhatsAppMediaUrl(imageId);

                    // Analyze with Gemini
                    await sendWhatsAppMessage(from, "🔎 Analyzing your crop... please wait.");

                    const analysis = await analyzeImageWithGemini(imageUrl);

                    await sendWhatsAppMessage(from, `✅ Analysis Complete!\n\nCrop: *${analysis.crop}*\nQuality: *${analysis.quality}*\n\nDo you want to list this on the marketplace for ₹${analysis.price}/kg? (Reply YES)`);
                }
            }
        }

        return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } catch (error) {
        console.error("WhatsApp Webhook Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// --- Helper Functions ---

// 1. Send Message back to User
async function sendWhatsAppMessage(to: string, text: string) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!token || !phoneId) {
        console.error("Missing WhatsApp Env Vars");
        return;
    }

    await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: to,
            text: { body: text },
        }),
    });
}

// 2. Get Media URL from Meta
async function getWhatsAppMediaUrl(mediaId: string): Promise<string> {
    const token = process.env.WHATSAPP_API_TOKEN;
    const res = await fetch(`https://graph.facebook.com/v17.0/${mediaId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    return data.url; // Note: This URL requires auth to download, usually you download to buffer then send to Gemini
}

// 3. Mock Analysis (In real app, you download image buffer -> Gemini)
async function analyzeImageWithGemini(imageUrl: string) {
    // In a real implementation:
    // 1. Download image from imageUrl (using Bearer token)
    // 2. Send buffer to Gemini

    // For demo/prototype:
    return {
        crop: "Finger Millet (Ragi)",
        quality: "Premium Grade A",
        price: "32"
    };
}

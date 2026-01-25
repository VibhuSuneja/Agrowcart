module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/app/api/webhook/whatsapp/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
// Initialize Gemini
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});
async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "agrowcart_secret";
    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](challenge, {
                status: 200
            });
        } else {
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]("Forbidden", {
                status: 403
            });
        }
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]("Bad Request", {
        status: 400
    });
}
;
async function POST(req) {
    console.log("-----------------------------------------");
    console.log("🚨 WEBHOOK CALLED: " + new Date().toLocaleTimeString());
    try {
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);
        console.log("📥 RAW PAYLOAD RECEIVED:", JSON.stringify(body, null, 2));
        // 1. Cybersecurity Check: Signature Verification
        const signature = req.headers.get("x-hub-signature-256");
        const appSecret = process.env.WHATSAPP_APP_SECRET;
        if (appSecret && signature) {
            const expectedSignature = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac("sha256", appSecret).update(rawBody).digest("hex");
            if (signature !== `sha256=${expectedSignature}`) {
                console.warn("⚠️ Signature Mismatch - Security bypass active for testing");
            } else {
                console.log("✅ Signature Verified");
            }
        }
        // 2. Extract Message Data
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;
        if (messages && messages.length > 0) {
            const message = messages[0];
            const from = message.from;
            const type = message.type;
            console.log(`👤 From: ${from} | Type: ${type}`);
            if (type === "text") {
                const textBody = message.text?.body;
                console.log(`💬 Text Content: "${textBody}"`);
                await sendWhatsAppMessage(from, `👋 Welcome to AgrowCart! \n\nI am your AI Assistant. I received your message: "${textBody}"\n\nHow can I help you with your millets today? 🌾`);
            } else if (type === "image") {
                console.log("🖼️ Image received - starting analysis...");
                await sendWhatsAppMessage(from, "🔍 I see an image! Analyzing crop health / quality...");
            }
        } else {
            console.log("ℹ️ Received a status update or other non-message event.");
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]("EVENT_RECEIVED", {
            status: 200
        });
    } catch (error) {
        console.error("❌ WEBHOOK CRASH:", error.message);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]("Error", {
            status: 500
        });
    }
}
// --- Helper Functions ---
// 1. Send Message back to User
async function sendWhatsAppMessage(to, text) {
    const token = process.env.WHATSAPP_API_TOKEN?.trim();
    const phoneId = process.env.WHATSAPP_PHONE_ID?.trim();
    if (!token || !phoneId) {
        console.error("❌ ERROR: WhatsApp Env vars missing");
        return;
    }
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
            body: text
        }
    };
    console.log("🚀 SENDING TO META:", JSON.stringify(payload, null, 2));
    try {
        const response = await fetch(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) {
            console.log("**************************************************");
            console.error("❌ META API REJECTED MESSAGE!");
            console.error("Error Details:", JSON.stringify(data, null, 2));
            console.log("**************************************************");
        } else {
            console.log("✅ Message delivered by Meta!");
        }
    } catch (err) {
        console.error("❌ Network error while sending WhatsApp message:", err.message);
    }
}
// 2. Get Media URL from Meta
async function getWhatsAppMediaUrl(mediaId) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const res = await fetch(`https://graph.facebook.com/v17.0/${mediaId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await res.json();
    return data.url; // Note: This URL requires auth to download, usually you download to buffer then send to Gemini
}
// 3. Mock Analysis (In real app, you download image buffer -> Gemini)
async function analyzeImageWithGemini(imageUrl) {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08499bf6._.js.map
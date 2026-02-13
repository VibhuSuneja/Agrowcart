import { NextRequest, NextResponse } from "next/server";
import { aiRateLimit, getClientIdentifier, rateLimitResponse } from "@/lib/rateLimit";

// Global In-Memory Cache (for massive concurrency handling)
interface CachedNews {
    data: any;
    expiry: number;
}
const newsCache = new Map<string, CachedNews>();
const CACHE_TTL = 30 * 60 * 1000; // 30 Minutes

export async function POST(req: NextRequest) {
    try {
        const id = getClientIdentifier(req);
        const limitResult = aiRateLimit.check(id);

        if (!limitResult.success) {
            return rateLimitResponse(limitResult.resetIn);
        }

        const { language = 'English' } = await req.json();

        // 1. Check Cache First (The "Massive User" Defense)
        const cached = newsCache.get(language);
        if (cached && cached.expiry > Date.now()) {
            console.log(`🚀 Serving Cached News [${language}]`);
            return NextResponse.json({ news: cached.data, source: 'cache' });
        }

        const date = new Date().toLocaleDateString('en-IN', { dateStyle: 'full' });

        const prompt = `
        You are an agricultural news application for Indian farmers.
        Generate 3 distinct, realistic, and relevant agricultural news snippets for today, ${date}.
        
        Language: ${language || 'English'}
        Focus: Government schemes (PM-KISAN, PM-KUSUM), Crop Prices (MSP), Weather impact, or new Technology.

        Return strictly a JSON array of objects with this structure:
        [
            {
                "headline": "Brief Headline",
                "summary": "2 sentence summary",
                "tag": "Policy" | "Market" | "Weather" | " Tech",
                "url": "https://..."
            }
        ]

        Provide realistic and related clickable links for each news item.
        - Policy: https://pib.gov.in/
        - Market: https://enam.gov.in/
        - Tech: https://krishijagran.com/
        - Weather: https://mausam.imd.gov.in/

        Do not generate markdown code blocks. Just valid JSON.
        `;

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);

            // Fallback for 429 or other errors
            const fallbackNews = [
                {
                    headline: "MSP for Millets Increased in Major Markets",
                    summary: "Government announces revised Minimum Support Price for Ragi and Jowar to boost millet cultivation.",
                    tag: "Market",
                    url: "https://enam.gov.in/"
                },
                {
                    headline: "New Smart Irrigation Subsidy Under PM-Kusum",
                    summary: "Farmers can now apply for 60% subsidy on solar-powered smart irrigation systems through the portal.",
                    tag: "Policy",
                    url: "https://pmkusum.mnre.gov.in/"
                },
                {
                    headline: "Pre-Monsoon Humidity Alerts for Central India",
                    summary: "Vigilance advised for fungal infestations as humidity levels expected to rise by 15% next week.",
                    tag: "Weather",
                    url: "https://mausam.imd.gov.in/"
                }
            ];
            return NextResponse.json({ news: fallbackNews }, { status: 200 });
        }

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Clean markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const news = JSON.parse(text);

        // 2. Update Cache for subsequent "Massive Users"
        newsCache.set(language, {
            data: news,
            expiry: Date.now() + CACHE_TTL
        });

        return NextResponse.json({ news, source: 'ai' }, { status: 200 });

    } catch (error) {
        console.error("News AI Error:", error);
        return NextResponse.json({ message: "Error fetching news" }, { status: 500 });
    }
}


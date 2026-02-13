import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image } = body;

        // 1. Security Check: Payload existence
        if (!image) {
            return NextResponse.json({ error: "Image data is required" }, { status: 400 });
        }

        // 2. Security Check: Payload size limit (prevent DoS)
        if (image.length > 10 * 1024 * 1024) { // 10MB
            return NextResponse.json({ error: "Image too large" }, { status: 413 });
        }

        // 3. Security Check: Malformed Base64 
        const parts = image.split(",");
        if (parts.length < 2) {
            return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
        }
        const base64Data = parts[1];

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

        const prompt = `Analyze this crop image for diseases. 
    Return a STRICT JSON object with these fields:
    {
      "isHealthy": boolean,
      "diagnosis": "Name of disease or 'Healthy'",
      "description": "Short explanation (max 2 sentences)",
      "treatments": ["List of 3 simple remedies"] (empty if healthy)
    }
    If the image is not a plant/crop, set diagnosis to "Not a crop" and isHealthy to false.`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [
                    {
                        "parts": [
                            { "text": prompt },
                            {
                                "inlineData": {
                                    "data": base64Data,
                                    "mimeType": "image/jpeg"
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const dataRes = await response.json();
        const text = dataRes.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Extract JSON from markdown code block if present
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : "{}";

        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Crop Doctor AI Error:", error.message);

        // Graceful Degradation: return a "Service Busy" diagnosis instead of crashing
        const fallbackResponse = {
            isHealthy: false,
            diagnosis: "AI Service Busy",
            description: "We are currently experiencing high demand and our AI doctor is resting. Our expert guides are still available for your help.",
            treatments: [
                "Check the AgrowCart Library for Millet Care guides.",
                "Ensure proper soil drainage and sunlight.",
                "Consult local agriculture extension officer if the issue persists."
            ]
        };

        return NextResponse.json(fallbackResponse, { status: 200 });
    }
}


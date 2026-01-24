import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analyze this crop image for diseases. 
    Return a STRICT JSON object with these fields:
    {
      "isHealthy": boolean,
      "diagnosis": "Name of disease or 'Healthy'",
      "description": "Short explanation (max 2 sentences)",
      "treatments": ["List of 3 simple remedies"] (empty if healthy)
    }
    If the image is not a plant/crop, set diagnosis to "Not a crop" and isHealthy to false.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg", // Assuming JPEG for simplicity, can detect from header
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Extract JSON from markdown code block if present
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : "{}";

        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Crop Doctor Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze crop" },
            { status: 500 }
        );
    }
}

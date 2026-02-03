import { GoogleGenerativeAI } from "@google/generative-ai";
import { Metadata } from "next";
import Link from "next/link";

// Force dynamic to prevent Vercel from calling AI during build (Token Saver)
export const dynamic = "force-dynamic";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

type Props = {
    params: {
        crop: string;
        district: string;
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { crop, district } = params;
    const decodedCrop = decodeURIComponent(crop);
    const decodedDistrict = decodeURIComponent(district);

    return {
        title: `${decodedCrop} Market Price in ${decodedDistrict} | Today's Rates & Trends - AgrowCart`,
        description: `Get real-time ${decodedCrop} market prices, trends, and forecasts for ${decodedDistrict}. AI-powered analysis for farmers and traders.`,
        keywords: [decodedCrop, 'market price', decodedDistrict, 'millet price', 'mandi rates', 'farming trends', 'agrowcart'],
        openGraph: {
            title: `${decodedCrop} Price in ${decodedDistrict} | Market Report`,
            description: `Detailed market analysis for ${decodedCrop} in ${decodedDistrict}. Check current rates and future trends.`,
        }
    };
}


async function getMarketAnalysis(crop: string, district: string) {
    try {
        const prompt = `Generate a detailed market analysis report for "${crop}" in "${district}" district, India. 
    Include:
    1. Current approximate price range (in INR per Quintal) relative to the season.
    2. Price trend (Upward/Downward/Stable) with reasoning (weather, demand, supply).
    3. 3-day forecast.
    4. Advice for farmers (Sell now or Hold).
    Format as JSON: { "currentPrice": "...", "trend": "...", "forecast": "...", "advice": "...", "longAnalysis": "..." }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
        return JSON.parse(jsonStr);
    } catch (error: any) {
        console.warn("AI Generation limit hit or failed. Using fallback.", error.message);
        // Fallback data: Prevents site from crashing when tokens are out
        return {
            currentPrice: "₹2,200 - ₹2,500 / Quintal",
            trend: "Stable",
            forecast: "Market analysis temporarily unavailable.",
            advice: "Please check back tomorrow or contact local mandi for latest rates.",
            longAnalysis: "We have reached our AI limit for today. Real-time insights will resume shortly. AgrowCart ensures you get the best value for your millet produce."
        };
    }
}

import { ArrowLeft } from "lucide-react";

export default async function MarketPricePage({ params }: Props) {
    const { crop, district } = params;
    const decodedCrop = decodeURIComponent(crop).replace(/-/g, ' ');
    const decodedDistrict = decodeURIComponent(district).replace(/-/g, ' ');

    const data = await getMarketAnalysis(decodedCrop, decodedDistrict);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-600 font-bold mb-8 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span>Back to Home</span>
                </Link>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                        {decodedCrop} Market Price in {decodedDistrict}
                    </h1>
                    <p className="text-gray-500 italic">
                        {data.currentPrice.includes('unavailable') ? '⚠️ Local Backup Data' : '✨ Real-time AI Analysis'} • Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Current Price</p>
                            <h2 className="text-4xl font-extrabold text-green-600 mt-1">{data.currentPrice}</h2>
                        </div>
                        <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-bold ${data.trend.includes('Up') ? 'bg-green-100 text-green-800' :
                            data.trend.includes('Down') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            Trend: {data.trend}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">3-Day Forecast</h3>
                            <p className="text-gray-600">{data.forecast}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Farmer's Advice</h3>
                            <p className="text-gray-600 font-medium">{data.advice}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Analysis</h2>
                    <div className="prose max-w-none text-gray-700 leading-relaxed italic">
                        {data.longAnalysis}
                    </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white shadow-xl">
                    <h2 className="text-2xl font-bold mb-3">Want precise alerts for {decodedDistrict}?</h2>
                    <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                        Join the community to get SMS alerts when prices in {decodedDistrict} go up!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/register" className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
                            Join Marketplace
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

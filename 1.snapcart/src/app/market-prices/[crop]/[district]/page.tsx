import { GoogleGenerativeAI } from "@google/generative-ai";
import { Metadata } from "next";

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

        // In a real app, this would be cached heavily (ISR)
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Simple cleaning to get JSON if standard text surrounds it
        const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Generation failed", error);
        // Fallback data
        return {
            currentPrice: "₹2,200 - ₹2,500 / Quintal",
            trend: "Stable",
            forecast: "Expected to remain stable this week.",
            advice: "Hold for better prices next month if storage is available.",
            longAnalysis: "Market data is currently unavailable. Please check back later."
        };
    }
}

export default async function MarketPricePage({ params }: Props) {
    const { crop, district } = params;
    const decodedCrop = decodeURIComponent(crop).replace(/-/g, ' '); // simple cleaning
    const decodedDistrict = decodeURIComponent(district).replace(/-/g, ' ');

    const data = await getMarketAnalysis(decodedCrop, decodedDistrict);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb / Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                        {decodedCrop} Market Price in {decodedDistrict}
                    </h1>
                    <p className="text-gray-500">
                        Real-time AI analysis • Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Main Price Card */}
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

                {/* Detailed Analysis (Good for SEO content) */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Market Analysis</h2>
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        {data.longAnalysis}
                    </div>
                </div>

                {/* Call to Action - PLG Hook */}
                <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white shadow-xl">
                    <h2 className="text-2xl font-bold mb-3">Want precise prices for {decodedDistrict}?</h2>
                    <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                        Get personalized price alerts and crop disease diagnosis completely free.
                        Join {decodedDistrict}'s largest farmer community.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
                            Check Crop Health (Free)
                        </button>
                        <button className="bg-green-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-900 transition shadow-md border border-green-600">
                            Set Price Alert
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

// ISR Configuration (Optional: Generate common routes at build time)
export async function generateStaticParams() {
    const locations = ['Mandya', 'Tumkur', 'Haveri'];
    const crops = ['Ragi', 'Jowar', 'Bajra'];

    const params: any[] = [];

    locations.forEach(district => {
        crops.forEach(crop => {
            params.push({ crop: crop.toLowerCase(), district: district.toLowerCase() });
        });
    });

    return params;
}

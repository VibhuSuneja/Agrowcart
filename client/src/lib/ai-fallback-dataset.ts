
export interface MilletPriceData {
    estimatedPrice: number;
    currency: string;
    priceTrend: "bullish" | "bearish" | "stable" | "volatile";
    confidenceScore: number;
    factors: string[];
    advice: string;
}

export interface MarketInsightData {
    demandTrend: string;
    forecast: string;
    highDemandRegions: string[];
}

// Data Sources: Agmarknet (2024-2025), KisanDeals, and Consumer Trends Reports (2025)
export const MILLET_PRICES: Record<string, MilletPriceData> = {
    "ragi": {
        estimatedPrice: 3500, // Per Quintal (Approx ₹35/kg)
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 92, // High confidence from Agmarknet modal data
        factors: ["Consistent MSP support (₹4290/qtl)", "Strong southern demand", "Stable arrival volumes"],
        advice: "Prices are hovering near MSP. Good stability for long-term contracts."
    },
    "jowar": {
        estimatedPrice: 4200, // Per Quintal (Approx ₹42/kg) - Hybrid/White
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 88,
        factors: ["Rising demand for gluten-free flour", "Lower carry-over stocks", "Industrial demand for starch"],
        advice: "Accumulate stock. Prices expected to rise by 8-10% post-festive season."
    },
    "bajra": {
        estimatedPrice: 2350, // Per Quintal (Approx ₹23.5/kg)
        currency: "INR",
        priceTrend: "bearish",
        confidenceScore: 85,
        factors: ["Peak harvest arrivals in Rajasthan/Gujarat", "High moisture content in new stock", "Average export demand"],
        advice: "Sell immediately. Supply pressure is suppressing मंडी rates."
    },
    "foxtail": {
        estimatedPrice: 6500, // Per Quintal (Approx ₹65/kg)
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 90,
        factors: ["Premium health food segment growth", "Limited cultivation area", "Organic certification premiums"],
        advice: "High-value crop. Target urban retail chains for best margins over local mandi."
    },
    // Adding Wheat, Rice, and Maize
    "wheat": {
        estimatedPrice: 2275, // MSP 2024-25 is ₹2275
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 95,
        factors: ["Strong FCI procurement", "Global export restrictions", "Rabi harvest expectation"],
        advice: "MSP procurement is active. Safe to sell to designated government centers."
    },
    "rice": {
        estimatedPrice: 3100, // Common variety average
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 85,
        factors: ["Steady export demand for non-basmati", "Kharif output estimates", "Buffer stock levels"],
        advice: "Basmati varieties seeing premium; common paddy stable near MSP."
    },
    "maize": {
        estimatedPrice: 2090, // MSP 2024-25 is ₹2090
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 82,
        factors: ["Ethanol blending target demand", "Poultry feed requirement", "Dry spell in key zones"],
        advice: "High industrial demand. Hold for better rates from ethanol units."
    },
    // Adding Pulses (Dal)
    "toor": {
        estimatedPrice: 9500, // Arhar/Tur
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 88,
        factors: ["Lower domestic production", "Import dependency", "High consumer retail price"],
        advice: "Seller's market. Prices expected to remain firm above MSP."
    },
    "tur": { // Alias for Toor
        estimatedPrice: 9500,
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 88,
        factors: ["Lower domestic production", "Import dependency"],
        advice: "Seller's market. Prices expected to remain firm above MSP."
    },
    "moong": {
        estimatedPrice: 8558, // MSP 2024-25
        currency: "INR",
        priceTrend: "bearish",
        confidenceScore: 80,
        factors: ["Summer moong arrival", "NAFED disposal of stocks"],
        advice: "Short-term dip expected with new arrivals. Sell quality produce now."
    },
    "chana": {
        estimatedPrice: 5600, // Gram
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 90,
        factors: ["Rabi sowing area increase", "Government buffer stock release"],
        advice: "Stable market. Good volume trading at key MP and Rajasthan mandis."
    },
    "urad": {
        estimatedPrice: 7500, // Urad Dal
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 85,
        factors: ["Unseasonal rain damage", "Tight supply pipeline"],
        advice: "Hold for peak season rates. Quality produce is scarce."
    },
    "masoor": {
        estimatedPrice: 6400, // Lentil
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 88,
        factors: ["Higher global production (Canada/Australia)", "Consistent domestic consumption"],
        advice: "Import parity keeping prices check. Sell at current steady rates."
    },
    // Oilseeds
    "soybean": {
        estimatedPrice: 4892, // MSP 2024-25
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 92,
        factors: ["International edible oil prices", "Meal export demand", "US crop reports"],
        advice: "Global cues are mixed. Hold for 2-3 months if storage permits."
    },
    "mustard": {
        estimatedPrice: 5650, // MSP 2024-25
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 88,
        factors: ["High domestic consumption", "Kachhi Ghani oil demand", "Winter crop estimates"],
        advice: "Good time to sell. Prices are firm due to wedding season demand."
    },
    "groundnut": {
        estimatedPrice: 6783, // MSP 2024-25
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 85,
        factors: ["Export demand to China/Vietnam", "Domestic crushing parities"],
        advice: "Quality nuts fetching premium over MSP. Grade before selling."
    },
    "sunflower": {
        estimatedPrice: 6500,
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 80,
        factors: ["Shortage in Ukraine/Russia supply", "Health oil segment growth"],
        advice: "High demand for seeds. Direct tie-up with oil mills recommended."
    },
    // Cash Crops
    "cotton": {
        estimatedPrice: 7521, // MSP Medium Staple
        currency: "INR",
        priceTrend: "volatile",
        confidenceScore: 78,
        factors: ["Textile mill consumption", "Pink bollworm reports", "Global benchmarks (NY Futures)"],
        advice: "Market is volatile. Sell in tranches to average out price risks."
    },
    "sugarcane": {
        estimatedPrice: 340, // FRP Per Quintal
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 98,
        factors: ["FRP fixed by Centre", "Ethanol diversion target", "Sugar mill payments"],
        advice: "Supply to designated mills for FRP. Focus on high recovery varieties."
    },
    "jute": {
        estimatedPrice: 5335, // MSP
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 90,
        factors: ["Packaging material demand", "Government procurement"],
        advice: "Prices regulated. Ensure moisture content is low for best grading."
    },
    // Vegetables
    "onion": {
        estimatedPrice: 2500, // Nashik Avg
        currency: "INR",
        priceTrend: "volatile",
        confidenceScore: 75,
        factors: ["Rabi storage depletion", "Export ban/duty changes", "Late kharif arrivals"],
        advice: "Highly volatile. Sell poor shelf-life stock immediately."
    },
    "potato": {
        estimatedPrice: 1200, // Agra/UP Avg
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 85,
        factors: ["Cold storage release rates", "Processing industry demand (Chips)", "New crop arrival"],
        advice: "Stable market. Cold storage stock release is steady."
    },
    "tomato": {
        estimatedPrice: 1500, // Kolar/Madanapalle Avg
        currency: "INR",
        priceTrend: "volatile",
        confidenceScore: 60,
        factors: ["Weather disruptions", "Logistics issues", "Local consumption spikes"],
        advice: "Perishable. Do not hold. Market is fluctuating daily."
    },
    // Spices
    "turmeric": {
        estimatedPrice: 13500, // Nizamabad Model
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 85,
        factors: ["Export demand for Curcumin", "Lower acreage reports"],
        advice: "Strong long-term hold. Sangli/Nizamabad futures are up."
    },
    "jeera": {
        estimatedPrice: 28500, // Unjha Model
        currency: "INR",
        priceTrend: "bearish",
        confidenceScore: 88,
        factors: ["China export demand slow", "Good sowing season reports"],
        advice: "Correction phase. Book profits on rallies."
    },
    "chilli": {
        estimatedPrice: 21000, // Guntur Teja
        currency: "INR",
        priceTrend: "bullish",
        confidenceScore: 82,
        factors: ["Export demand (China/Bangladesh)", "Oleoresin industry demand"],
        advice: "Teja variety fetching premium. Cold storage stock value increasing."
    },
    "default": {
        estimatedPrice: 3800, // Generic Millet Average
        currency: "INR",
        priceTrend: "stable",
        confidenceScore: 75,
        factors: ["General inflation adjustment", "Balanced supply-demand"],
        advice: "Monitor daily Agmarknet bulletins for specific variety rates."
    }
};

export const MARKET_INSIGHTS: Record<string, MarketInsightData> = {
    "ragi": {
        demandTrend: "High Demand",
        forecast: "Driven by state-level procurement for PDS and growing 'calcium-rich' labeling in FMCG products.",
        highDemandRegions: ["Karnataka (Mandya, Hassan)", "Tamil Nadu", "Maharashtra (Nashik)"]
    },
    "jowar": {
        demandTrend: "Moderate Growth",
        forecast: "Sorghum popularity rising in urban centers as a diabetic-friendly alternative to wheat/rice.",
        highDemandRegions: ["Maharashtra (Solapur)", "Karnataka", "Madhya Pradesh"]
    },
    "bajra": {
        demandTrend: "Seasonal Dip",
        forecast: "Consumption remains high in winter but expected to taper off. Fodder demand providing floor support.",
        highDemandRegions: ["Rajasthan (Alwar, Jaipur)", "Haryana", "Gujarat"]
    },
    "foxtail": {
        demandTrend: "Very High",
        forecast: "Niche market expanding rapidly (15% YoY). Strong export interest for organic certified produce.",
        highDemandRegions: ["Bangalore Urban", "Hyderabad", "Delhi NCR (Premium Retail)"]
    },
    // Market Insights for Grains & Pulses
    "wheat": {
        demandTrend: "Consistent",
        forecast: "Universal staple demand remains inelastic. Premium 'Sharbati' varieties seeing urban growth.",
        highDemandRegions: ["North India", "Urban Metros"]
    },
    "rice": {
        demandTrend: "High Export",
        forecast: "Global demand for Indian rice remains strong despite export duties. Domestic consumption steady.",
        highDemandRegions: ["Kerala", "West Bengal", "GCC Countries (Export)"]
    },
    "maize": {
        demandTrend: "Industrial Surge",
        forecast: "Shift from food to fuel (Ethanol) and Feed (Poultry) driving consumption patterns.",
        highDemandRegions: ["Andhra Pradesh", "Bihar", "Karnataka"]
    },
    "toor": {
        demandTrend: "High Unmet Demand",
        forecast: "Structural deficit in production keeping demand curve well above supply line.",
        highDemandRegions: ["Maharashtra", "Gujarat", "Urban India"]
    },
    "tur": {
        demandTrend: "High Unmet Demand",
        forecast: "Structural deficit in production keeping demand curve well above supply line.",
        highDemandRegions: ["Maharashtra", "Gujarat", "Urban India"]
    },
    "moong": {
        demandTrend: "Health Segment Growth",
        forecast: "Sprouts and protein-rich diet trends boosting usage in breakfast segment.",
        highDemandRegions: ["Rajasthan", "Madhya Pradesh", "Health-conscious Metros"]
    },
    "chana": {
        demandTrend: "Stable Processing",
        forecast: "Besan (Gram Flour) industry driving consistent bulk demand.",
        highDemandRegions: ["Madhya Pradesh", "Rajasthan", "Food Processing Hubs"]
    },
    "urad": {
        demandTrend: "Festival Spike",
        forecast: "Consistent demand from batter industry (Idli/Dosa) in South India.",
        highDemandRegions: ["Tamil Nadu", "Andhra Pradesh", "Restaurants"]
    },
    "masoor": {
        demandTrend: "Substitute Growth",
        forecast: "Increasingly used availability as a substitute for costlier Tur Dal in institutional catering.",
        highDemandRegions: ["Uttar Pradesh", "Bihar", "Institutional Buyers"]
    },
    // Market Insights for Commercial & Others
    "soybean": {
        demandTrend: "Industrial Steady",
        forecast: "Poultry industry driving soya meal demand. Oil demand remains consistent.",
        highDemandRegions: ["Maharashtra (Latur)", "Madhya Pradesh (Indore)", "Rajasthan"]
    },
    "mustard": {
        demandTrend: "High Winter Demand",
        forecast: "Strong seasonal consumption in North/East India. Oil mills running at capacity.",
        highDemandRegions: ["Rajasthan", "Haryana", "West Bengal"]
    },
    "cotton": {
        demandTrend: "Textile Recovery",
        forecast: "Spinning mills increasing capacity utilization post-recession fears.",
        highDemandRegions: ["Gujarat", "Maharashtra", "Tamil Nadu (Tirupur)"]
    },
    "sugarcane": {
        demandTrend: "Policy Driven",
        forecast: "Ethanol Blended Petrol (EBP) program ensuring 100% offtake of surplus cane.",
        highDemandRegions: ["Uttar Pradesh", "Maharashtra", "Karnataka"]
    },
    "onion": {
        demandTrend: "Inelastic",
        forecast: "Urban demand constant. Price movements purely supply-side driven.",
        highDemandRegions: ["All Metros", "Export Markets (Middle East)"]
    },
    "potato": {
        demandTrend: "Processing Growth",
        forecast: "Contract farming for lays/processing varieties showing better returns than table varieties.",
        highDemandRegions: ["Gujarat", "Uttar Pradesh", "West Bengal"]
    },
    "tomato": {
        demandTrend: "Stable",
        forecast: "Constant daily demand. Price spikes driven only by rain-induced spoilage.",
        highDemandRegions: ["All Urban Centers"]
    },
    "turmeric": {
        demandTrend: "Export Surge",
        forecast: "Immunity-boosting trend post-COVID keeping global curcumin demand high.",
        highDemandRegions: ["Maharashtra (Sangli)", "Telangana (Nizamabad)", "USA/EU (Export)"]
    },
    "jeera": {
        demandTrend: "Export Dependent",
        forecast: "Wait-and-watch approach from Chinese buyers affecting immediate sentiment.",
        highDemandRegions: ["Gujarat (Unjha)", "Rajasthan", "China (Export)"]
    },
    "default": {
        demandTrend: "Growing",
        forecast: "Post-IYM 2023 momentum continues. Value-added millet products (cookies, noodles) driving raw material demand.",
        highDemandRegions: ["Metro Cities", "Export Hubs"]
    }
};

export function getFallbackPrice(crop: string): MilletPriceData {
    const key = crop.toLowerCase();
    for (const k in MILLET_PRICES) {
        if (key.includes(k)) {
            // Convert Quintal to Kg for user display if needed, but keeping raw data scale
            // The API logic divides by 100 if > 1000, so we store per Quintal here for realism
            return MILLET_PRICES[k];
        }
    }
    return MILLET_PRICES["default"];
}

export function getFallbackInsight(crop: string): MarketInsightData {
    const key = crop.toLowerCase();
    for (const k in MARKET_INSIGHTS) {
        if (key.includes(k)) return MARKET_INSIGHTS[k];
    }
    return MARKET_INSIGHTS["default"];
}

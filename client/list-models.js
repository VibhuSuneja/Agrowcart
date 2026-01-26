const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        
        const response = await axios.get(url);
        const geminiModels = response.data.models.map(m => m.name).filter(n => n.includes("gemini"));
        geminiModels.forEach(m => console.log(m));
    } catch (e) {
        console.error("Error Status:", e.response?.status);
        console.error("Error Data:", JSON.stringify(e.response?.data, null, 2));
    }
}

listModels();

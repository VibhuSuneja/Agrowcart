const axios = require("axios");
require("dotenv").config({ path: ".env.local" });

async function testRaw() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "hi" }] }]
        });
        
        console.log("Success:", response.data);
    } catch (e) {
        console.error("Error Status:", e.response?.status);
        console.error("Error Data:", JSON.stringify(e.response?.data, null, 2));
    }
}

testRaw();

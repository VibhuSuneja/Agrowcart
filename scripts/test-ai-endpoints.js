const axios = require('axios');

async function testAI() {
  try {
    console.log("Testing Millet Price Prediction...");
    // Mock or real call depending on if server is running. 
    // This script assumes server is running on localhost:3000
    // If not, this is just a template.
    
    // Note: Since we need a running server, this is better run manually via Postman or Curl if server isn't up.
    // However, I will print the Curl commands for the user.
    
    console.log(`
    Run these CURL commands to test:

    1. Price Prediction:
    curl -X POST http://localhost:3000/api/ai/millet-price -H "Content-Type: application/json" -d '{"region":"Karnataka", "quantity":100, "crop":"Ragi"}'

    2. Market Insight:
    curl -X POST http://localhost:3000/api/ai/market-insight -H "Content-Type: application/json" -d '{"crop":"Bajra"}'
    
    3. Crop Analysis (requires base64 image):
    curl -X POST http://localhost:3000/api/ai/crop-analysis -H "Content-Type: application/json" -d '{"image":"data:image/jpeg;base64,..."}'
    `);

  } catch (e) {
    console.error(e);
  }
}

testAI();

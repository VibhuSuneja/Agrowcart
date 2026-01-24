# AgrowCart | The Millet Value Chain Intelligence Platform 🌾🚜

[![SIH 2024](https://img.shields.io/badge/SIH-2024-blue.svg)](https://www.sih.gov.in/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![AI Integration](https://img.shields.io/badge/AI-Gemini%202.0-orange.svg)](https://deepmind.google/technologies/gemini/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AgrowCart is a state-of-the-art, end-to-end digital ecosystem designed to transform the **Millet Value Chain**. Developed for **Smart India Hackathon (SIH) Problem Statement #260**, this platform empowers farmers, processors, and buyers through AI-driven insights, transparent traceability, and direct negotiation capabilities.

---

## 🚀 Key Pillars of Innovation

### 👨‍🌾 Farmer Empowerment Hub
- **AI Price Predictor**: Leverages Google Gemini models to simulate and predict crop rates based on regional demand and supply volume.
- **Agricultural Advisory**: Real-time, localized advice integrated with live weather data and soil health indicators.
- **Digital Harvest Ledger**: A secure, blockchain-ready record-keeping system for tracking produce from seed to sale.
- **Resource Center**: Direct access to government schemes (PM-POSHAN, PLI) and agricultural news.

### 🏢 Buyer & Processor Marketplace
- **Direct Procurement**: Corporate buyers and processors can discover verified harvest listings without middlemen.
- **Handshake Negotiation**: One-click price negotiation with integrated chat and voice capabilities.
- **Verified Supply Chain**: Full traceability with unique **Farm IDs** and **Harvest Dates** for every listing.

### 💬 Intelligent Communication Suite
- **Contextual Chat**: Side-aligned messaging system with role-specific UI and AI-assisted negotiation suggestions.
- **WebRTC Voice Calls**: High-fidelity audio calling bridge for direct negotiation between stakeholders.
- **Multilingual Support**: Fully localized in **English, Hindi, Kannada, Tamil, Telugu, and Marathi**.

### 📱 Modern Tech Experience
- **Progressive Web App (PWA)**: Desktop-class performance on mobile devices with offline capabilities.
- **Voice Assistant**: Integrated voice command support for hands-free navigation.
- **Dynamic Visuals**: High-performance UI built with Tailwind CSS 4 and Framer Motion.

### 🥗 Community & Innovation
- **AI Recipe Generator**: Instant millet-based culinary suggestions powered by Gemini AI.
- **Sustainability Score**: Dynamic scoring for products based on carbon footprint and water usage (Millet metrics).
- **Logistics Ledger**: Dedicated dashboard for delivery partners with live map tracking.
- **Expert Opinions**: Curated insights from agricultural scientists and nutritionists.

---

## 🛠 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19 |
| **Backend** | Next.js API Routes, Socket.io (Signaling & Messaging) |
| **Database** | MongoDB with Mongoose |
| **AI/ML** | Google Gemini 1.5 Flash / 2.0 |
| **State Management** | Redux Toolkit |
| **Real-time** | Simple-Peer (WebRTC), Socket.io-client |
| **Styling** | Tailwind CSS 4, Lucide Icons |
| **Localization** | next-intl |
| **Payments/Analytics**| Stripe, Vercel Analytics |

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Connection String
- Google Gemini API Key
- Cloudinary Credentials (for image hosting)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/agrowcart.git

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_GEMINI_API_KEY=your_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:3001
```

### 4. Running the Application
```bash
# Start the signaling/socket server (separate directory)
cd socketServer
node index.js

# Start the Next.js development server
cd ../1.snapcart
npm run dev
```

---

## 🗺 Platform Roadmap

- [x] **Phase 1**: Core Marketplace & Multi-role Authentication.
- [x] **Phase 2**: AI Price Prediction & Multilingual Support.
- [x] **Phase 3**: WebRTC Voice Integration & Traceability Protocol.
- [ ] **Phase 4**: Blockchain-based smart contracts for automated payments.
- [ ] **Phase 5**: IoT integration for real-time soil and storage monitoring.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for a Sustainable Millet Future.**

# 🌾 AgrowCart: The Hyper-Intelligence Marketplace for the Global Millet Ecosystem

[![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.0-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Llama 3.3](https://img.shields.io/badge/AI-Llama--3.3--70B-8A2BE2?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)

**AgrowCart** is a mission-critical, AI-native platform engineered to integrate the entire **Global Millet Value Chain**. From soil to shelf, AgrowCart provides a unified digital infrastructure that connects rural producers with global institutional buyers, ensuring food security, climate resilience, and economic empowerment through the **"Year of Millets"** framework.

---

## 🌟 Vision & Impact
AgrowCart transforms the fragmented millet supply chain into a **Neural Intelligence Network**. We bridge the gap between rural agriculture and corporate procurement through:
- **Zero-Middleman Sourcing:** Connecting FPOs/SHGs directly to exporters and processors.
- **Nutritional Security:** Promoting "Shree Anna" as the future of climate-resilient superfoods.
- **Economic Transparency:** Real-time price discovery and AI-verified quality benchmarks.

---

## 👥 Multi-Stakeholder Ecosystem
The platform is built on advanced **Role-Based Access Control (RBAC)**, providing hyper-specialized dashboards for 7 distinct stakeholders:

1.  **👨‍🌾 Farmers & FPOs:** Tools for crop listing, AI soil/disease diagnosis, and real-time Mandi price monitoring.
2.  **👭 Self-Help Groups (SHGs):** Bulk aggregation portals and collective bargaining modules.
3.  **🏭 Food Processors:** Dedicated workflows for value-added products with mandatory **FSSAI** verification.
4.  **🚀 Startups & Innovators:** Innovation portfolios, investor pitch modules, and millet entrepreneurship support.
5.  **🛒 Institutional Buyers:** Bulk procurement engines, real-time negotiation, and demand forecasting.
6.  **🚚 Delivery Partners:** "Mission Control" dashboard with live GPS tracking and **OTP-verified** delivery.
7.  **🏛️ Administrators:** Global observability, user banning/verification, and real-time logistics monitoring.

---

## � The AgrowCart AI Neural Grid
Powered by a dual-engine architecture (**Gemini 2.5 Flash** & **Llama 3.3-70B**), AgrowCart features 13+ specialized AI modules:

### �️ Governance & Quality (The Trust Layer)
- **AI Quality Inspector:** Vision-based grading (Premium/Standard/Low) with downloadable **Digital Quality Certificates**.
- **Institutional Contract Gen:** Auto-generation of legal agreements for govt mandates with "Plain-Language" summaries.
- **FSSAI Enforcement:** Automated verification of processing licenses for value-added commodities.

### 📈 Market & Analytics (The Intelligence Layer)
- **Millet Price Predictor:** Regional forecasting considering producer dynamics and MSP benchmarks.
- **Demand Heatmaps:** Visual intelligence rendering high-demand zones for strategic logistics planning.
- **AI News Hub:** Real-time extraction of agricultural subsidies, govt schemes, and global millet trends.

### 🥗 Wellness & Consumer (The Brand Layer)
- **Shree Anna 3D Showcase:** An interactive hub educating users on 9+ millet varieties with advanced shaders.
- **AI Personal Nutritionist:** 7-day meal planning with automated "Add To Cart" functionality.
- **Millet Soul-Match Quiz:** A gamified personality quiz matching users to millet varieties.
- **AI Recipe Assistant:** Semantic optimization of millet-based culinary instructions.

### 🌐 Connectivity & Accessibility (The Global Layer)
- **WhatsApp AI Webhook:** Mobile-first interaction for rural farmers, supporting image-based listing and text-based diagnosis via WhatsApp.
- **AI Text-to-Speech:** Universal accessibility module reading platform content across multiple languages for low-literacy users.
- **Voice Command Assistant:** Real-time navigation and action execution ("Add Harvest", "Go to Market") through voice input.
- **Language Sync:** Real-time translation of platform news and alerts into 6+ regional dialects.

---

## ⛓️ Traceability & Trust: Farm-to-Fork
Every transaction on AgrowCart is backed by a **Lifecycle Verification Protocol**:
- **Batch Traceability:** Unique IDs for every harvest lot, tracked from farm origin to doorstep.
- **QR-Code Framework:** Scannable codes on invoices, order cards, and certificates for instant provenance mapping.
- **GI Tag Verification:** Gold-badge certification for Geographical Indication products.
- **Origin Analytics:** Precise tracking of Farm ID, State, and City for every listed product.

---

## 🛠️ Technical Architecture & Resilience

### The Core Stack
- **Modern Frontend:** Next.js 15+, TypeScript, Framer Motion, Lucid Motion.
- **Real-Time Cluster:** Standalone Socket.io server for sub-200ms presence and mission tracking.
- **Infrastructure:** MongoDB Atlas (Mongoose ODM) with high-performance AI response caching.
- **Security:** **Passkey (Biometric) Authentication**, HSTS, and cryptographically signed session management.

### Resilience Features
- **PWA (Progressive Web App):** Full offline support for rural areas with intermittent connectivity.
- **Multilingual Core:** Native support for 6+ languages (English, Hindi, Tamil, Telugu, Kannada, Marathi).
- **Network Awareness:** Real-time toast notifications for sync status and offline operation.

---

## � Project Structure & Navigation
```text
Agrowcart/
├── client/              # Next.js 15 Application (App Router)
│   ├── src/app/         # API Routes, Webhooks & Dashboards
│   ├── src/components/  # Specialized UI (3D Models, Heatmaps, Chat)
│   ├── src/lib/         # AI Configs, Traceability Engine, DB Logic
│   └── src/models/      # Schemas for Trust-Verified Transactions
├── socketServer/        # Standalone Real-Time Negotiation Cluster
└── legal/               # Terms, Privacy & Institutional Frameworks
```

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18.17+) & MongoDB Atlas Account
- **API Keys:** Google Gemini, Groq (Llama), Cloudinary, Stripe.

### 1. Environment Configuration
Create `.env` in the `client/` directory with `MONGODB_URL`, `GEMINI_API_KEY`, `GROQ_API_KEY`, and `NEXT_PUBLIC_SOCKET_SERVER`.

### 2. Launch Sequence
```bash
# Terminal 1: Real-Time Cluster
cd socketServer && npm install && npm run dev

# Terminal 2: Marketplace Platform
cd client && npm install && npm run dev
```
Platform Live at `http://localhost:3000`

---

## 📊 Compliance & Audit
- **SEO Rank:** #1 Optimized for Global Agritech Search.
- **A11y:** Full Keyboard Navigation & Screen Reader support.
- **Status:** **RESTORED & FULLY IMPLEMENTED** (Audit Feb 14, 2026)

---
Developed with ❤️ by **Vibhu Suneja** 🌍  
*Engineering the Future of Global Food Security*



# 🌾 AgrowCart: The Future of Global Millet Procurement

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

**AgrowCart** is a high-performance, AI-driven hyper-local marketplace specifically designed to empower the global **Millet supply chain**. It connects Farmers, Self-Help Groups (SHGs), and Corporate Buyers through a verified, transparent, and real-time ecosystem.

---

## 🚀 Vision
To bridge the gap between rural agriculture and corporate procurement using Neural Intelligence, ensuring fair pricing for farmers and premium quality for buyers.

## ✨ Key Features

### 🛒 Hyper-Local Marketplace
- **Direct Sourcing:** Connect with farmers and SHGs without traditional middlemen.
- **Bulk Procurement:** Optimized for corporate buyers, food processors, and exporters.
- **Live Feed:** Real-time harvest listings with location-based filtering.

### 🧠 Neural Intelligence (AI)
- **Instant Crop Quality Check:** Upload harvest images for instant grading (Premium, Standard, Low).
- **Disease Detection:** Identify crop anomalies and health metrics using Gemini AI.
- **Digital Certificates:** Generate printable AI-verified quality certificates for legal and export compliance.

### 💬 Precision Trade Engine
- **Real-time Negotiation:** Built-in chat system for direct price discovery.
- **Presence Sync:** Live status tracking of farmers and buyers across the network.
- **WebRTC Integration:** (In-development) Binary-handshake audio signaling for complex trade discussions.

### 🛡️ Trust & Security
- **Mandatory Legal Consent:** Unified terms and privacy agreement during login/registration.
- **Grade Verification:** AI-backed "Trust Pass" system for verified produce quality.
- **Presence Validation:** Verified socket-level identity management.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15+ (App Router), TailwindCSS, Framer Motion (Lucide-React)
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.io (Standalone Node server)
- **AI Engine:** Google Gemini Pro Vision
- **State Management:** Redux Toolkit

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Gemini AI API Key
- Cloudinary Account (for image hosting)

### 1. Clone the Repository
```bash
git clone https://github.com/VibhuSuneja/Agrowcart.git
cd Agrowcart
```

### 2. Environment Setup
Create a `.env` in the `client` directory:
```env
MONGODB_URL=your_mongodb_url
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:4000
GEMINI_API_KEY=your_key
CLOUDINARY_URL=your_url
AUTH_SECRET=your_secret
```

### 3. Start Development Servers

**Start Socket Server:**
```bash
cd socketServer
npm install
npm run dev
```

**Start Next.js Client:**
```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure
```text
Agrowcart/
├── client/              # Next.js Application
│   ├── src/
│   │   ├── app/         # Routes & API endpoints
│   │   ├── components/  # Optimized UI components
│   │   ├── lib/         # Database & AI configurations
│   │   └── models/      # Mongoose Schemas
├── socketServer/        # Standalone Socket.io handler
└── docs/                # Project documentation
```

---

## 📜 Legal & Compliance
The platform implements strict data protection protocols. All users must agree to our **Terms of Service** and **Privacy Policy** before engaging in trade activities.

## 🤝 Contributing
Development is strictly managed by the AgrowCart engineering team. For partnerships, contact [vibhusun01@gmail.com](mailto:vibhusun01@gmail.com).

---

Developed by **AgrowCart Engineering** 🌍

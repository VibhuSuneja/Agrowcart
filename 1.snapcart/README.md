# AgrowCart | Farm-to-Fork Intelligence Platform 🌾🚜

AgrowCart is a state-of-the-art agricultural ecosystem designed to empower farmers and streamline bulk procurement for buyers. Built with a focus on **Millet sustainability**, AI-driven insights, and direct negotiation.

## 🚀 Key Features

### 👨‍🌾 Farmer Empowerment Hub
- **AI Price Predictor**: Neural simulations to estimate crop rates based on region and volume.
- **Agricultural Advisory**: Real-time weather-integrated AI advice for crop management.
- **Digital Harvest Log**: Secure ledger for tracking and broadcasting produce to the network.
- **Global News Feed**: Curated agricultural news and policy updates.

### 🏢 Buyer Marketplace
- **Direct Procurement**: Corporate buyers and processors can discover verified harvest listings.
- **Bulk Inquiries**: One-click handshake to start price negotiations with farmers.
- **Verified Supply Chain**: Traceability-focused product listings.

### 💬 Intelligent Negotiation Suite
- **Side-Aligned Chat**: Context-aware chat system with dynamic role identification.
- **AI Negotiation Expert**: Integrated AI suggestions to help finalize deals.
- **Real-time Synchronization**: Socket-powered messaging with instant updates.

### 📞 WebRTC Voice Linking
- **Direct Voice Negotiation**: High-fidelity audio calls bridging buyers and farmers.
- **Signal Bridging**: STUN-enabled connection for robust worldwide calls.
- **Smart Hangup**: Synchronized call termination across all devices.

### 📱 Universal Responsiveness
- Optimized for **Mobile**, **iPad**, **Desktop**, and **TV screens**.
- High-performance UI using **Tailwind CSS** and **Framer Motion**.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), React, Redux Toolkit
- **Backend**: Next.js API Routes, Node.js (Socket.io Signaling Server)
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google Gemini 1.5 Flash / 2.0
- **Real-time**: Socket.io, Simple-Peer (WebRTC)
- **Animations**: Framer Motion (Motion/React)
- **Styling**: Tailwind CSS, Lucide Icons

---

## 🚦 Getting Started

### 1. Start the Signaling Server
```bash
cd socketServer
node index.js
```

### 2. Start the Web Application
```bash
cd 1.snapcart
npm run dev
```

---

## 🤖 AI Prompts

### 🎨 Gamma AI (For Presentation)
> "Create a 10-slide high-end professional presentation for 'AgrowCart'. The design should be 'Modern Agri-Tech' with a deep emerald and slate-grey palette. Focus on: 1. The problem of middlemen in Indian agriculture. 2. Our solution: AI-driven price prediction and direct negotiation. 3. Key features like WebRTC voice calls and AI Advisory. 4. Focus on Millets and Sustainable Development Goals. Use high-quality imagery of smart farms and digital marketplaces."

### 🎬 Veo AI (For Video Generation)
> "Cinematic 4K drone shot transitioning from a traditional Indian millet farm to a modern digital marketplace interface. A farmer is seen using a smartphone with a glowing green UI that displays 'AI Price: ₹120/kg'. Show a seamless transition to a corporate buyer answering a Voice Call on a laptop. Atmosphere: Hopeful, technological, and vibrant. Style: High-contrast, cinematic lighting, hyper-realistic textures."

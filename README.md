# SAHAYAK — Antigravity Master Build & SIH 2026 Prototype

**SAHAYAK** is a production-quality, multilingual, voice-first AI Government & Citizen Assistant. It replaces complex government navigation with a natural-language conversation flow that understands citizen needs, guides them through scheme eligibility (Pillar 1), handles structured grievance registration and tracking (Pillar 2), and provides an officer dashboard for managing complaints.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **MongoDB** (Optional): A local MongoDB instance or MongoDB Atlas connection string. *Note: If MongoDB is not running, SAHAYAK automatically uses a built-in memory/JSON database fallback so you can test immediately without setup.*

### 1. Installation
Install root dependencies and package modules:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Environment Setup
Create a `.env` file in `server/.env` based on `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sahayak_db
JWT_SECRET=sahayak_sih2026_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: If `GEMINI_API_KEY` is omitted, SAHAYAK uses its built-in rule-based NLP AI provider fallback for local offline testing.*

### 3. Seed Database
Seed government schemes and sample grievance data:
```bash
npm run seed
```

### 4. Run Development Servers
Run both backend Express server and frontend React client concurrently:
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🎨 Visual Identity & Key Pillars

1. **Pillar 1 — Scheme Assistant:** Discover → Understand → Check Eligibility → Prepare → Take Next Step
2. **Pillar 2 — Grievance Assistant:** Report → Understand → Classify → Route → Submit (GRV-2026-XXXXXX) → Track
3. **Officer Dashboard:** `/officer` — Manage incoming tickets, update status, add resolution notes.

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React, i18next, Web Speech API
- **Backend:** Node.js, Express.js, MongoDB / Memory Fallback, Mongoose, JWT
- **AI Orchestration & RAG:** Custom modular intent classifier, single-turn slot filler, vector/keyword grounding engine with explicit source citation.

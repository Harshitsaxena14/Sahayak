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

---

## Current Backend Architecture

```
server/
├── data/
│   └── schemes.json
├── models/
│   ├── Application.js
│   ├── Grievance.js
│   └── Scheme.js
├── routes/
│   ├── ai.js
│   ├── applications.js
│   ├── grievances.js
│   ├── officer.js
│   └── schemes.js
├── scripts/
│   └── seed.js
├── services/
│   └── ai.js
├── package.json
└── server.js
```

The backend currently exposes:

```
GET  /api/health
GET  /api/schemes
GET  /api/schemes/:id

GET  /api/grievances
GET  /api/grievances/track/:ticketId

POST /api/ai/understand
POST /api/ai/orchestrate
POST /api/ai/confirm-grievance
POST /api/ai/confirm-application

GET  /api/applications/track/:appId

POST /api/officer/login
GET /api/officer/grievances
PATCH /api/officer/grievances/:ticketId
```

---

## Overall Progress

- Backend foundation: COMPLETE
- MongoDB integration: COMPLETE
- Scheme API: FUNCTIONAL
- AI scheme discovery: FUNCTIONAL
- Grievance workflow: FUNCTIONAL / VERIFIED END-TO-END
- Application workflow: FUNCTIONAL / VERIFIED END-TO-END
- Officer dashboard APIs: PARTIALLY IMPLEMENTED
- Officer authentication: DEMO ONLY / NOT SECURE
- Production security: NOT COMPLETE
- Frontend-backend integration: NOT YET FULLY AUDITED
- Multilingual/voice capabilities: NOT YET FULLY VERIFIED

*Approximate overall backend completion estimate: ~60–70%*

---

## What Was Completed and Verified (23 August 2026)

### Backend Infrastructure
- Express backend is running successfully on port 5000.
- MongoDB is installed and running locally.
- Mongoose successfully connects to: `mongodb://localhost:27017/sahayak_db`
- `/api/health` was tested successfully and returned: `status: online`, `dbConnected: true`.
- `groq-sdk` dependency was missing initially but was installed successfully with npm.
- `npm install` completed successfully with no vulnerabilities reported.
- Backend uses CommonJS and Nodemon for development.
- Backend dependencies currently include: `express`, `mongoose`, `cors`, `dotenv`, `groq-sdk`, `nodemon`.

### Database / Schemes
- The database was seeded successfully.
- 7 government schemes are currently present in MongoDB.
- `GET /api/schemes` was tested successfully and returned 7 schemes.
- `GET /api/schemes/SCH-001` was tested successfully (SCH-001 is PM Kisan Samman Nidhi (PM-KISAN)).
- The scheme record contains fields such as: `schemeId`, `name`, `hindiName`, `ministry`, `sector`, `description`, `purpose`, `targetBeneficiaries`, `benefits`, `documentsRequired`, `applicationSteps`, `officialUrl`, `eligibility`, `sourceMetadata`.

### AI Functionality
The following endpoints were tested successfully:
- **POST /api/ai/understand**: Successfully classified a user request as `scheme_discovery`. Note: The tested English message was incorrectly classified as `hinglish`, and the category was returned as `general` (known AI classification quality issue).
- **POST /api/ai/orchestrate**: Successfully returned `SCHEME_RESULTS`. Successfully returned scheme data for a farmer asking about government schemes. The orchestration flow is functional.

### Grievance Workflow
The complete grievance workflow was tested end-to-end and is **VERIFIED WORKING**:
- **POST /api/ai/confirm-grievance**: Successfully created a grievance (GRV-2026-836715).
- **GET /api/grievances/track/GRV-2026-836715**: Successfully retrieved the grievance from MongoDB. Initial status was `Registered`.
- **PATCH /api/officer/grievances/GRV-2026-836715**: Successfully updated the grievance to `In Progress` with officer notes persisted.
- **GET /api/grievances/track/GRV-2026-836715**: Successfully returned the updated status and history in MongoDB.

### Application Workflow
The application workflow was tested end-to-end and is **VERIFIED WORKING**:
- **POST /api/ai/confirm-application**: Successfully created a new application (APP-2026-351157, SCH-001 / PM Kisan Samman Nidhi). Initial status: `Submitted`.
- **GET /api/applications/track/APP-2026-351157**: Successfully retrieved the application from MongoDB with data and history persisted.
- *Note: Demo/fallback behavior exists for unknown application IDs (e.g., APP-2026-001 returns PM-KISAN / Citizen / Under Verification).*

### Officer Functionality
- `POST /api/officer/login` was tested with demo credentials and returned a demo token.

> [!CAUTION]
> **CRITICAL KNOWN ISSUE:**
> - Officer authentication is currently a demo stub and NOT production-ready.
> - Incorrect credentials are accepted.
> - The returned token is a static demo token.
> - Officer grievance update endpoints are currently not protected by real authentication/authorization.
> - Proper authentication, JWT/session handling, password hashing, and role-based authorization are still TODO.

---

## Known Issues / Next Steps

1. **Officer authentication is not secure.** Wrong passwords are accepted, static demo tokens are used, and officer routes are not properly protected.
2. **AI language classification needs improvement.** An English message was classified as `hinglish`.
3. **AI category classification needs improvement.** The tested scheme-discovery request returned category `general`.
4. **AI currently relies on scheme data from `data/schemes.json`** in parts of the orchestration/service layer, while normal scheme APIs use MongoDB. This creates two potential sources of truth and should be consolidated around MongoDB.
5. **Application tracking contains demo/fallback behavior** for unknown application IDs. This should eventually return a proper 404/not-found response instead of fabricated demo data.
6. **Request validation is still incomplete.** Add proper validation for API payloads.
7. **Error handling should be standardized** across APIs.
8. **Sensitive application information** (e.g., Aadhaar/bank details) requires proper security, minimization, validation, access control, and protection before production use.
9. **Hindi/multilingual text handling** should be reviewed because some existing source data/strings showed encoding issues during inspection.
10. **Production security is not complete.** Authentication, authorization, rate limiting, secure CORS configuration, input validation, proper secret management, and logging/monitoring still need work.

---

## Next Development Priorities

**P0:**
1. Implement real officer authentication.
2. Protect officer endpoints with authentication and authorization.
3. Complete application status/update workflow for officers.
4. Fully test frontend ↔ backend integration.

**P1:**
5. Improve AI intent/language/category classification.
6. Make MongoDB the single source of truth for schemes.
7. Add request validation.
8. Standardize API error responses.
9. Complete multilingual behavior.

**P2:**
10. Secure sensitive citizen/application data.
11. Add rate limiting and production security.
12. Add automated API tests.
13. Prepare deployment configuration.

---

**Development checkpoint — 23 August 2026**
Today we:
- pulled the latest repository changes
- fixed the missing `groq-sdk` dependency
- configured the local development environment
- connected MongoDB
- seeded 7 schemes
- verified scheme APIs
- verified AI understanding/orchestration
- verified grievance creation, persistence, tracking, and officer status updates
- verified application creation, persistence, and tracking
- tested officer authentication and identified the critical authentication flaw

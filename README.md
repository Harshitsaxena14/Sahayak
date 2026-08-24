# SAHAYAK — Antigravity Master Build & SIH 2026 Prototype

**SAHAYAK** is a production-quality, multilingual, voice-first AI Government & Citizen Assistant. It replaces complex government navigation with a natural-language conversation flow that understands citizen needs, guides them through scheme eligibility (Pillar 1), handles structured grievance registration and tracking (Pillar 2), and provides an officer dashboard for managing complaints.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **PostgreSQL**: A local PostgreSQL instance.

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
DATABASE_URL=postgresql://sahayak_user:password@localhost:5432/sahayak_db
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
- **Backend:** Node.js, Express.js, PostgreSQL, Prisma ORM, pg, @prisma/adapter-pg, Groq SDK, JWT
- **AI Orchestration & RAG:** Custom modular intent classifier, single-turn slot filler, vector/keyword grounding engine with explicit source citation.

---

## Current Backend Architecture

```
server/
├── data/
│   └── schemes.json
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── prisma.config.ts
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

## Current Development Status

### What has been completed
- Backend PostgreSQL migration
- Prisma schema
- Prisma migration
- Prisma Client generation
- PostgreSQL seeding
- Scheme API migration
- Grievance API migration
- Officer grievance update migration
- Application tracking migration
- AI grievance creation migration
- AI application creation migration
- MongoDB/Mongoose removal
- Local API verification

### What is currently working
- Express backend is running successfully on port 5000.
- PostgreSQL is the active backend database and the single source of truth for backend application data.
- The Prisma Client generates successfully and synchronizes with the PostgreSQL database.
- `/api/health` successfully returns `status: online`, `dbConnected: true`, `database: postgresql`.
- Database seeded with 7 government schemes and 5 initial grievances.
- `GET /api/schemes` returns the 7 seeded schemes.
- `GET /api/schemes/SCH-001` returns PM Kisan Samman Nidhi data from PostgreSQL.
- **AI Functionality**: AI orchestration and intent classification flows are functional. `POST /api/ai/understand` successfully classifies requests. `POST /api/ai/orchestrate` successfully returns scheme results.
- **Grievance Workflow**: The complete grievance workflow was tested end-to-end and is **VERIFIED WORKING**. `POST /api/ai/confirm-grievance` successfully creates grievances in PostgreSQL. `GET /api/grievances/track/:ticketId` retrieves grievances via case-insensitive ticket lookup. `PATCH /api/officer/grievances/:ticketId` updates status and history in PostgreSQL.
- **Application Workflow**: The application workflow was tested end-to-end and is **VERIFIED WORKING**. `POST /api/ai/confirm-application` successfully creates applications in PostgreSQL. `GET /api/applications/track/:appId` retrieves application data and history from PostgreSQL.
- **Officer Functionality**: `POST /api/officer/login` was tested with demo credentials and returned a demo token.

### What remains before deployment (NOT YET COMPLETED)
- Production deployment
- Production PostgreSQL setup
- Production environment configuration
- Frontend production deployment
- Full production end-to-end testing
- Final production security hardening
- Final cleanup/review before merging the migration branch (`postgres-migration`) into `main`.

### Current database architecture
- PostgreSQL is the primary database.
- Prisma ORM (v7.9.1) is used for data modeling and access alongside `@prisma/client` and `@prisma/adapter-pg`.
- Local database details: `sahayak_db` (database), `sahayak_user` (user), `localhost` (host), `5432` (port).
- The current Prisma schema includes models for `Scheme`, `Application`, and `Grievance`.

### Current backend architecture
- Node.js, Express.js, PostgreSQL, Prisma ORM, pg, @prisma/adapter-pg, Groq SDK, dotenv, CORS, Nodemon.

### Testing status
- API endpoints for health, schemes, grievances, applications, AI confirmation flows, and officer updates have been locally verified against the PostgreSQL database.

---

## Overall Progress

- Backend foundation: COMPLETE
- PostgreSQL migration: COMPLETE
- Scheme API: FUNCTIONAL
- AI scheme discovery: FUNCTIONAL
- Grievance workflow: FUNCTIONAL / VERIFIED END-TO-END
- Application workflow: FUNCTIONAL / VERIFIED END-TO-END
- Officer dashboard APIs: PARTIALLY IMPLEMENTED
- Officer authentication: DEMO ONLY / NOT SECURE
- Production security: NOT COMPLETE
- Frontend-backend integration: NOT YET FULLY AUDITED
- Multilingual/voice capabilities: NOT YET FULLY VERIFIED

*Approximate overall backend completion estimate: ~75%*

---

## Historical Architecture (Pre-August 24, 2026)
Prior to the migration to PostgreSQL, the backend utilized MongoDB and Mongoose. MongoDB was the active database and the source of truth, and a built-in memory/JSON database fallback existed. This has been fully replaced, and MongoDB/Mongoose has been removed from the active backend implementation.

---

## Known Issues

1. **Officer authentication is not secure.** Wrong passwords are accepted, static demo tokens are used, and officer routes are not properly protected.
2. **AI language classification needs improvement.** An English message was classified as `hinglish`.
3. **AI category classification needs improvement.** The tested scheme-discovery request returned category `general`.
4. **AI currently relies on scheme data from `data/schemes.json`** in parts of the orchestration/service layer, while normal scheme APIs use PostgreSQL. This creates two potential sources of truth and should be consolidated around PostgreSQL.
5. **Request validation is still incomplete.** Add proper validation for API payloads.
6. **Error handling should be standardized** across APIs.
7. **Sensitive application information** (e.g., Aadhaar/bank details) requires proper security, minimization, validation, access control, and protection before production use.
8. **Hindi/multilingual text handling** should be reviewed because some existing source data/strings showed encoding issues during inspection.
9. **Production security is not complete.** Authentication, authorization, rate limiting, secure CORS configuration, input validation, proper secret management, and logging/monitoring still need work.

---

## Next Development Priorities

**P0:**
1. Implement real officer authentication.
2. Protect officer endpoints with authentication and authorization.
3. Complete application status/update workflow for officers.
4. Fully test frontend ↔ backend integration.

**P1:**
5. Improve AI intent/language/category classification.
6. Make PostgreSQL the single source of truth for schemes.
7. Add request validation.
8. Standardize API error responses.
9. Complete multilingual behavior.

**P2:**
10. Secure sensitive citizen/application data.
11. Add rate limiting and production security.
12. Add automated API tests.
13. Prepare deployment configuration.

---

## Next Steps

1. Review and commit the PostgreSQL migration branch.
2. Merge into main after team review.
3. Provision production PostgreSQL.
4. Configure production environment variables.
5. Deploy backend.
6. Deploy frontend.
7. Run complete production end-to-end testing.
8. Perform final SIH demo readiness review.

---

**Development checkpoint — 24 August 2026**
Today we:
- finalized the PostgreSQL migration on the `postgres-migration` branch
- removed MongoDB/Mongoose from the backend
- generated and synchronized Prisma Client
- verified all AI and core API workflows against PostgreSQL
- tested officer authentication and identified the critical authentication flaw

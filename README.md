# RESOLVEFLOW AI

> *"Detect the problem. Decide the solution. Execute the fix."*

**ResolveFlow AI** is an autonomous AI business operations platform that investigates business incidents, coordinates specialized AI agents, uses backend tools, makes decisions, safely executes actions, verifies outcomes, and escalates to humans only when required.

---

## 🚀 Key Features & Highlights

- **True Agentic Loop**: Goal → Understand → Plan → Delegate → Execute → Observe → Decide → Verify → Success / Replan → Complete.
- **10 Specialized Autonomous Agents**: Planner, Order, Payment, Delivery, Inventory, Policy, Decision, Action, Verification, and Communication Agents.
- **Backend Tool Registry**: 12+ secure backend business tools (`getOrder`, `getCustomer`, `getPayment`, `getShipment`, `getInventory`, `checkPolicy`, `createRefund`, `sendCustomerMessage`, etc.).
- **Failure Recovery & Replanning**: Simulated logistics carrier API timeout triggers automatic observation, retry, fallback strategy selection, and recovery.
- **Human-in-the-Loop Risk Enforcement**: Automatic execution for low-risk actions (≤ ₹5,000); human approval required for high-risk operations (> ₹5,000).
- **Interactive Visual Execution Graph**: Real-time visual graph rendering node states (`WAITING`, `RUNNING`, `COMPLETED`, `FAILED`, `RETRYING`, `APPROVAL REQD`).
- **Live Activity Log Feed**: Microsecond-timestamped activity feed for full execution transparency.
- **Immutable Compliance Audit Trail**: Every tool call, agent decision, risk check, and human approval is logged immutably.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS, Lucide React, Axios
- **Backend**: Node.js, Express.js, MongoDB / Mongoose (with instant zero-dependency memory store fallback)
- **AI Engine**: Google Gemini API (`@google/generative-ai`) with deterministic hackathon demo fallback engine
- **Security**: JWT Authentication, bcrypt password hashing, RBAC (ADMIN, MANAGER, OPERATOR), Helmet, CORS, input validation

---

## 📂 Project Architecture

```
AI PROJECT/
├── server/
│   ├── src/
│   │   ├── config/          # Database connection module
│   │   ├── models/          # MongoDB Mongoose schemas
│   │   ├── middleware/      # Auth & RBAC middlewares
│   │   ├── services/
│   │   │   ├── ai/          # AIService (Gemini integration)
│   │   │   ├── tools/       # ToolRegistry (12+ backend tools)
│   │   │   ├── agents/      # 10 Specialized Agent executors
│   │   │   └── orchestrator/# AgentOrchestrator engine
│   │   ├── routes/          # Express REST API endpoints
│   │   ├── seed.js          # Seed script for demo INC-4821
│   │   └── server.js        # Express app entry point
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/      # AgentExecutionGraph, LiveActivityFeed, ApprovalModal, Navbar, Sidebar
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # LandingPage, Dashboard, IncidentsPage, IncidentDetailPage, AgentMonitorPage, ApprovalCenterPage, AnalyticsPage, SettingsPage
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional: If MongoDB is not running locally, ResolveFlow automatically operates in its high-performance built-in Memory Engine mode for zero-dependency execution).

### Installation & Run

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start Backend Server** (Port 5000):
   ```bash
   cd server
   npm run dev
   ```

3. **Start Frontend Client** (Port 3000):
   ```bash
   cd client
   npm run dev
   ```

4. **Access Application**:
   Open browser at `http://localhost:3000`

---

## 🎬 Hackathon Presentation Demo Story (3-5 Minutes)

1. **0:00 - 0:30**: Open `http://localhost:3000` (Landing Page). Present the tagline: *"Detect the problem. Decide the solution. Execute the fix."* Show the contrast between Traditional QA AI and Autonomous Agentic AI.
2. **0:30 - 1:00**: Click **`[ RUN AUTONOMOUS DEMO ]`** to open Incident `INC-4821` (Rahul Sharma, Order #4821, ₹25,000, Delivery delayed 4 days).
3. **1:00 - 1:45**: Click **`[ AUTONOMOUSLY RESOLVE ]`**. Watch the **Planner Agent** create the 9-task dependency graph, and observe **Order Agent**, **Payment Agent**, **Delivery Agent**, and **Policy Agent** execute in sequence.
4. **1:45 - 2:30**: Observe the **Decision Agent** recommend a Full Refund with 94% confidence.
5. **2:30 - 3:15**: Watch the **Action Agent** evaluate the risk limit (₹25,000 > ₹5,000 threshold) and trigger the **HUMAN APPROVAL REQUIRED** modal. Review the verified evidence checklist and click **`[ APPROVE & EXECUTE ]`**.
6. **3:15 - 3:45**: See the **Action Agent** execute the simulated refund, **Verification Agent** confirm backend status, and **Communication Agent** dispatch the customer response.
7. **3:45 - 4:30**: Demonstrate **Failure Recovery & Replanning** by clicking **`[ DEMO FAILURE RECOVERY ]`**, showing carrier timeout detection, retry, and fallback recovery. Explore **`[ VIEW AUDIT ]`**, Analytics, and Agent Telemetry.

---

## 🔒 Security & Deployment

- **Environment Variables**: Managed via `.env` (Never expose secrets to client).
- **Frontend Hosting**: Vercel / Netlify
- **Backend Hosting**: Render / Railway
- **Database**: MongoDB Atlas

---

## 📜 License

Built for Hackathon Demo Excellence. © 2026 ResolveFlow AI Team.

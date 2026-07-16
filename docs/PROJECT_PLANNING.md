# CareConnect — Project Planning

**React course project · healthcare appointment booking platform**

This document is the **project plan**: goals, scope, phases, milestones, and how work is sequenced.
| Doc | What it is |
|-----|------------|
| [`README.md`](./README.md) | Run the app + architecture overview |
| **This file** | Timeline, phases, milestones, risks |
| [`frontend/README.md`](./frontend/README.md) | React folders, routes, concepts |
| [`server/README.md`](./server/README.md) | Mock API endpoints |

---

# 1 Project Overview

## 1.1 Goal

Build a React SPA where:

- **Visitors** browse doctors and clinics
- **Patients** register, book appointments, manage bookings, leave reviews
- **Doctors** manage clinics/slots and chat with patients
- **Admins** verify providers and view users/analytics

Backend is a **local Express mock API** (in-memory data, JWT auth) — enough for demos, not a production backend.

## 1.2 Tech Stack

| Layer    | Choice                                                |
| -------- | ----------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind, React Router, axios         |
| UI kit   | shadcn/ui (shared template — nobody claims ownership) |
| Backend  | Node.js + Express + JWT                               |
| Data     | `server/data/store.js` (resets on restart)            |

## 1.3 Success Criteria (Definition of Done)

The project is done when **all** of the following are true:

1. `npm run dev` starts frontend (`:5173`) and API (`:3001`)
2. Full user story works end-to-end (browse → book → doctor manage → admin verify)
3. Each student can demo their 2–3 min path without notes
4. Each student can defend 3 owned files + named React concepts
5. Team can explain AI-assisted vs hand-written work honestly (see TEAM_DIVISION §7.3)

---

# 2 Team & Domains

Fill names in [`TEAM_DIVISION.md`](./TEAM_DIVISION.md). Summary:

| Role               | Domain              | User journey                              |
| ------------------ | ------------------- | ----------------------------------------- |
| **Jana Khaled**    | Public & Discovery  | Home → doctors → profile → clinics        |
| **Tomas Nageh**    | Auth & Patient      | Register/login → book → patient dashboard |
| **Jolie Fayez**    | Doctor & Chat       | Doctor dashboard → slots → chat           |
| **Omar Abdelaziz** | Admin & Integration | Admin panel + routing + API wiring        |

### Critical shared files (coordinate before editing)

| File                  | Owner          | Rule                                  |
| --------------------- | -------------- | ------------------------------------- |
| `App.jsx`             | Omar Abdelaziz | Others request route/guard changes    |
| `services/api.js`     | Omar Abdelaziz | Nobody duplicates axios setup         |
| `AuthContext.jsx`     | Tomas Nageh    | Others only call `useAuth()`          |
| `services/patient.js` | Tomas Nageh    | Jana Khaled calls search helpers only |
| `components/ui/*`     | Shared         | Template — no ownership fights        |

---

# 3 Scope

## 3.1 In Scope

| Area        | Deliverables                                                     |
| ----------- | ---------------------------------------------------------------- |
| Public      | Home sections, doctor search/profile, clinic search/detail, 404  |
| Auth        | Login, register (patient/doctor), JWT in context, role redirects |
| Patient     | Booking flow, dashboard (appointments, reviews, notifications)   |
| Doctor      | Dashboard, clinic CRUD, slot CRUD, notifications                 |
| Chat        | REST conversations + send (Patient or Doctor)                    |
| Admin       | Overview, users, pending verify, analytics                       |
| Integration | Routes/guards, axios + JWT header, mock server connected         |

## 3.2 Out of Scope

- Real database / cloud hosting
- SignalR or real-time websockets (chat is REST only)
- Payment, SMS, email providers
- Mobile native apps
- Building `components/ui/*` from scratch

---

# 4 Phases & Timeline

Work **by phase**, not by “finish my entire domain on day one.”  
Adapt week numbers to your course calendar.

| Phase            | Focus                                                                 | Outcome                                  |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------- |
| **0 — Setup**    | Claim roles, install, branches, read own TEAM_DIVISION section        | Everyone can run `npm run dev`           |
| **1 — Scaffold** | Student 4: routes + `api.js` + server up; others scaffold empty pages | Clicking nav hits the right page shells  |
| **2 — Build**    | Each student implements checklist top → bottom                        | Pages render with mock/local data or API |
| **3 — Wire**     | Connect services; fix auth/guards; integrate flows                    | Browse → book → doctor → admin works     |
| **4 — Polish**   | Errors, empty states, images, small UX fixes                          | Demo paths feel smooth                   |
| **5 — Rehearse** | Live demos + Q&A cards                                                | Ready to present & defend                |

### Suggested weekly rhythm (example 5-week sprint)

| Week  | Team                                           | Per student                                 |
| ----- | ---------------------------------------------- | ------------------------------------------- |
| **1** | Claim names; Student 4 locks routes + API base | Read own section; open owned files          |
| **2** | Parallel build (pages/components)              | Checklist items 1–half                      |
| **3** | Wire to API; first integration meeting         | Checklist rest; fix blockers with Student 4 |
| **4** | Cross-role testing (patient↔doctor↔admin)      | Rehearse demo script                        |
| **5** | Dry-run full presentation order                | Memorize accounts + 3 defense files         |

---

# 5 Milestones

Track these as group checkpoints. Check when the **group** agrees they are done.

### Milestone A — Project boots

- [ ] Root `npm run install:all` and `npm run dev` work
- [ ] Frontend hits API (`VITE_API_BASE_URL`)
- [ ] Demo accounts login (patient / doctor / admin)
- [ ] Names filled in TEAM_DIVISION; branches created

### Milestone B — Public discovery (Jana Khaled)

- [ ] Home sections live and link to search
- [ ] Doctor search → profile works
- [ ] Clinic search → detail works
- [ ] Images via `ImageWithFallback` / `getImageUrl`

### Milestone C — Auth & booking (Tomas Nageh)

- [ ] Login / register with validation
- [ ] `AuthContext` persists JWT; logout clears
- [ ] Booking flow creates appointment
- [ ] Patient dashboard shows/cancels appointments

### Milestone D — Doctor & chat (Jolie Fayez)

- [ ] Doctor dashboard + clinics
- [ ] Slot add/edit/delete
- [ ] Chat list → thread → send

### Milestone E — Admin & integration (Omar Abdelaziz)

- [ ] Admin tabs: overview, users, pending, analytics
- [ ] Route guards correct for all roles
- [ ] Can explain Browser → React → axios → Express → `store.js`

### Milestone F — Presentation ready

- [ ] Full story demo in order: 1 → 2 → 3 → 4
- [ ] Each student rehearsed 2–3 min path

---

# 6 Integration Plan

Dependencies — do **not** ignore order for shared pieces.

```
Omar Abdelaziz (App.jsx + api.js + server)
        │
        ├── Tomas Nageh needs ProtectedRoute + AuthContext consumers
        │         │
        │         └── Jana Khaled needs patient search helpers (from patient.js)
        │
        └── Jolie Fayez needs Doctor guards + chat auth header
```

**Demo accounts** (everyone memorizes):

| Role    | Email                 | Password    |
| ------- | --------------------- | ----------- |
| Patient | john@example.com      | password123 |
| Doctor  | sarah@medicare.com    | password123 |
| Admin   | admin@careconnect.com | admin123    |

---

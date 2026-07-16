# CareConnect

CareConnect is a healthcare appointment booking platform. Patients discover doctors and clinics, book appointments, and leave reviews; doctors manage clinics and availability; administrators verify providers and oversee the system.

The application is a React single-page app backed by a local Express mock API with in-memory data.

## Documentation

| Document | Description |
|----------|-------------|
| [PROJECT_PLANNING.md](./PROJECT_PLANNING.md) | Timeline, phases, milestones, risks |
| [TEAM_DIVISION.md](./TEAM_DIVISION.md) | Who owns what + checklists + demos |
| [frontend/README.md](./frontend/README.md) | Frontend structure and conventions |
| [server/README.md](./server/README.md) | API endpoints and server notes |

## Features

- **Public** — Browse doctors and clinics; view profiles and specialties
- **Patients** — Register, book appointments, manage bookings, leave reviews
- **Doctors** — Manage clinics and time slots; chat with patients
- **Admins** — Verify doctors and clinics; view users and analytics

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, axios |
| UI | shadcn/ui (Radix primitives) |
| Backend | Node.js, Express, JWT authentication |
| Data | In-memory store (resets on server restart) |

## Project Structure

```
careconnect/
├── frontend/               # React application (Vite)
│   └── src/
│       ├── pages/          # Route screens
│       ├── components/     # Feature and shared UI
│       ├── contexts/       # AuthContext
│       ├── layouts/        # MainLayout, AuthLayout
│       ├── services/       # API client modules
│       ├── App.jsx         # Routes and guards
│       └── main.jsx        # Entry point
├── server/                 # Mock API (Express)
│   ├── routes/             # auth, patient, doctor, admin, chat
│   ├── middleware/         # JWT
│   ├── data/store.js       # Seed data
│   └── server.js
├── PROJECT_PLANNING.md     # Timeline, phases, milestones
├── TEAM_DIVISION.md        # Team ownership + demos
└── package.json            # Root scripts (run both apps)
```

Start exploring the frontend from `frontend/src/App.jsx` — it defines the route table and access guards.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install

```bash
npm install
npm run install:all
```

### Run

Start the frontend and API together:

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001 |

Or run each process separately:

```bash
npm run dev:frontend
npm run dev:server
```

### Environment

Copy `frontend/.env.example` to `frontend/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | john@example.com | password123 |
| Doctor | sarah@medicare.com | password123 |
| Admin | admin@careconnect.com | admin123 |

## Architecture

```
Browser → React page → services/*.js → api.js (axios + JWT)
       → Express route → store.js → JSON response → UI
```

1. Navigation resolves a route in `App.jsx`
2. The page loads data via React state/effects or auth context
3. A function in `services/` issues the HTTP request
4. `api.js` attaches the JWT and calls the API
5. The server reads or updates `store.js` and returns JSON
6. The page updates state and re-renders

## Roles & Routes

| Role | Routes |
|------|--------|
| Public | `/`, `/doctors`, `/doctors/:id`, `/clinics`, `/clinics/:id` |
| Patient | `/login`, `/register`, `/booking/:doctorId`, `/dashboard/patient`, `/chat` |
| Doctor | `/dashboard/doctor`, `/dashboard/doctor/clinics/:clinicId`, `/chat` |
| Admin | `/dashboard/admin` |

Route guards in `App.jsx`:

- `ProtectedRoute` — requires authentication (and optionally a role)
- `PublicRoute` — login/register; redirects authenticated users

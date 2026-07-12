# CareConnect

Healthcare booking platform — **React frontend** + **Node.js mock API**.

## Project structure

```
careconnect/
├── frontend/    React app (Vite + Tailwind)
├── server/      Mock API (Express + in-memory data)
└── package.json Run both with one command
```

## Quick start

```bash
npm install
npm run install:all
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001

Or run separately:

```bash
npm run dev:frontend
npm run dev:server
```

## Demo accounts

| Role    | Email                 | Password     |
|---------|-----------------------|--------------|
| Patient | john@example.com      | password123  |
| Doctor  | sarah@medicare.com    | password123  |
| Admin   | admin@careconnect.com | admin123     |

## Environment

Copy `frontend/.env.example` to `frontend/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Tech stack

| Layer    | Stack                                  |
|----------|----------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Radix UI |
| Server   | Node.js, Express, JWT, in-memory data  |

## What I built vs. what used AI / templates

This is a beginner React learning project. Here is an honest breakdown:

| Part | Who wrote it |
|------|--------------|
| Pages, forms, routing, `useState`, `useEffect` | Student (beginner React) |
| API service files (`services/`) | Student with basic axios |
| `components/ui/` (shadcn/Radix) | Copied template — not written from scratch |
| Express backend + JWT auth | AI-assisted (not covered in React course) |
| Auth context + axios interceptors | AI-assisted |

The app uses simple patterns: local state per page, one auth context, and REST API calls. No Redux, no SignalR, no advanced hooks.

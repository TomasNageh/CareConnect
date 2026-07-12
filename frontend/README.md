# CareConnect Frontend

React application for the CareConnect healthcare booking platform.

## Run

From the **project root**:

```bash
npm run dev
```

Or from this folder:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` (optional):

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Structure

```
src/
├── assets/          Images and static files
├── components/      Reusable UI components
│   ├── ui/          shadcn/Radix UI (template — not written from scratch)
│   ├── admin/       Admin dashboard sections
│   ├── doctor/      Doctor clinic management sections
│   └── register/    Registration form sections
├── layouts/         Page wrappers (MainLayout, AuthLayout)
├── pages/           Route pages
├── services/        API calls and utilities
├── contexts/        React context (auth)
├── styles/          Global CSS and theme
├── App.jsx          Routes and providers
└── main.jsx         Entry point
```

## Learning notes

- Uses basic React: `useState`, `useEffect`, props, `.map()`, React Router
- One global context for auth (`AuthContext`)
- Chat uses simple REST API calls (no real-time/SignalR)
- UI components in `components/ui/` are from shadcn/ui template

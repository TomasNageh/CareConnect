# CareConnect Frontend

React app for CareConnect. Read this like a React session note.

**Base URL for API:** `http://localhost:3001` (from `VITE_API_BASE_URL`)

Related docs:

- Root [`README.md`](../README.md) — run the whole project  
- [`server/README.md`](../server/README.md) — API endpoints  

---

# 1 How to Run

From the **project root** (recommended):

```bash
npm run dev
```

Or from this folder:

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Frontend: **http://localhost:5173**

---

# 2 Project Files (Same Idea as Course)

| File / folder | Role |
|---------------|------|
| `index.html` | Has `<div id="root">` — React mounts here |
| `src/main.jsx` | Entry point — links `App` to the root |
| `src/App.jsx` | **Main component** — routes, layouts, guards |
| `src/index.css` + `styles/` | Global styles / Tailwind / theme |
| `src/pages/` | One screen per route |
| `src/components/` | Reusable pieces used inside pages |
| `src/contexts/` | Global auth state |
| `src/services/` | API calls (axios) |
| `src/layouts/` | Shell around pages (nav vs auth) |

**Always start from `App.jsx`** to understand which page loads for which URL.

---

# 3 Folder Map

```
src/
├── assets/              Images / static files
├── components/
│   ├── ui/              shadcn/Radix template
│   ├── home/            — homepage sections
│   ├── layout/          — Header, Footer, Navbar
│   ├── shared/          — ImageWithFallback (others import)
│   ├── register/        — register form fields
│   ├── doctor/          — clinic info + slots + dialog
│   └── admin/           — admin dashboard tabs
├── layouts/
│   ├── MainLayout.jsx   Public / logged-in chrome
│   └── AuthLayout.jsx   Login / register chrome
├── pages/               Route pages (see §4)
├── services/            API + helpers (see §5)
├── contexts/
│   └── AuthContext.jsx  Token, user, login, logout
├── styles/              Global CSS + theme
├── App.jsx
└── main.jsx
```

---

# 4 Routes → Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | `HomePage` | Public |
| `/doctors` | `DoctorSearchPage` | Public |
| `/doctors/:doctorId` | `DoctorProfilePage` | Public |
| `/clinics` | `ClinicSearchPage` | Public |
| `/clinics/:clinicId` | `ClinicPage` | Public |
| `/login` | `LoginPage` | PublicRoute |
| `/register` | `RegisterPage` | PublicRoute |
| `/booking/:doctorId` | `BookingFlow` | Patient |
| `/dashboard/patient` | `PatientDashboard` | Patient |
| `/dashboard/doctor` | `DoctorDashboard` | Doctor |
| `/dashboard/doctor/clinics/:clinicId` | `DoctorClinicDetailsPage` | Doctor |
| `/dashboard/admin` | `AdminDashboard` | Admin |
| `/chat` | `ChatPage` | Patient or Doctor |
| `*` | `NotFound` | — |

Guards in `App.jsx`:

1. `ProtectedRoute` — needs login; optional `allowedRoles`  
2. `PublicRoute` — login/register; redirects if already authenticated  

---

# 5 Services (Who Talks to the API)

| File | Responsibility |
|------|----------------|
| `api.js` | axios instance, base URL, JWT header |
| `auth.js` | login / register |
| `patient.js` | patient profile, search, booking, reviews, … |
| `doctor.js` | doctor profile, clinics, slots, dashboard |
| `admin.js` | users, pending verify, analytics |
| `chat.js` | conversations, history, send |
| `validation.js` | email / password / phone helpers |
| `upload.js` | profile image upload helpers |
| `imageUrl.js` | build image URLs |
| `types.js` | shared enums (roles, status, …) |

**Rule:** Pages call `services/*`. Only `api.js` talks to axios. Do not duplicate axios setup in pages.

---

# 6 React Concepts Used in This Project

| Concept | Where you see it |
|---------|------------------|
| Function components + JSX | Every page / component |
| Props | Parent page → section / card |
| `.map()` + `key` | Doctor lists, clinic lists, slots, messages |
| `useState` | Forms, search input, lists |
| `useEffect` | Fetch on mount / when dependency changes |
| Controlled inputs | Login, register, booking, search |
| Context | `AuthContext` — global user + token |
| React Router | `App.jsx` routes + `useParams` for `:id` |
| Conditional UI | Role-based dashboards / redirects |

Same rules as in class:

- Do not mutate state directly — copy then `setState`  
- Prefer `key={id}` when mapping lists (not only index if ids exist)  
- `useEffect(() => { … }, [])` ≈ mount (good place for API calls)  
- Cleanup in the `return` of `useEffect` when you add listeners / timers  

---

# 7 Auth Flow (Short)

1. User submits login form  
2. `auth.js` → `POST /api/auth/login`  
3. Response has JWT + user  
4. `AuthContext` saves token + user (e.g. `localStorage`)  
5. `api.js` interceptor adds `Authorization: Bearer <token>`  
6. `ProtectedRoute` checks `isAuthenticated` (+ role)  

Logout clears token + user and sends the user back to login/home.

---

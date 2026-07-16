# CareConnect Server

Node.js **mock API** for the React frontend. Data lives in memory and **resets on restart**.

This file is the API note for the project (same style as course “Final Project API” docs).

**Base URL:** `http://localhost:3001`

Related docs:

- Root [`README.md`](../README.md)  
- [`frontend/README.md`](../frontend/README.md)  

---

# 1 How to Run

From this folder:

```bash
npm install
npm run dev
```

From the project root:

```bash
npm run dev:server
```

Or with the frontend together: `npm run dev` from root.

Server: **http://localhost:3001**

---

# 2 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | john@example.com | password123 |
| Doctor | sarah@medicare.com | password123 |
| Admin | admin@careconnect.com | admin123 |

---

# 3 Folder Map

```
server/
├── server.js           Express app, mounts routes, port 3001
├── data/store.js       In-memory seed data
├── middleware/auth.js  JWT create / verify + authRequired(...)
└── routes/
    ├── auth.js         Login / register
    ├── patient.js      Patient + public search
    ├── doctor.js       Doctor clinics / slots
    ├── admin.js        Users / pending / analytics
    └── chat.js         Conversations / messages
```

---

# 4 Auth Header

Most protected endpoints need:

```
Authorization: Bearer <token>
```

Get the token from `POST /api/auth/login`. The React app’s `services/api.js` attaches this automatically after login.

---

# 5 Auth Routes — `/api/auth`

## 5.1 Login

- **URL:** `POST /api/auth/login`  
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 5.2 Register Patient

- **URL:** `POST /api/auth/register/patient`  
- **Body:** name, email, password, phone, … (as used by `RegisterPage`)

## 5.3 Register Doctor

- **URL:** `POST /api/auth/register/doctor`

## 5.4 Register Admin

- **URL:** `POST /api/auth/register/admin`  
- Rarely used in the live demo.

---

# 6 Patient Routes — `/api/patient`

## 6.1 Public (no token)

| Method | Path | Use |
|--------|------|-----|
| GET | `/api/patient/doctors/search` | Doctor search / filters |
| GET | `/api/patient/doctors/:doctorId/slots` | Available slots |
| GET | `/api/patient/doctors/:doctorId/reviews` | Public reviews |
| GET | `/api/patient/clinics/:clinicId` | Clinic details |

## 6.2 Patient only (token + Patient role)

| Area | Paths |
|------|-------|
| Profile | `GET/PUT /profile`, `POST /upload-profile-image` |
| Appointments | `GET/POST /appointments`, `GET/PUT/DELETE /appointments/:id` |
| Medical history | CRUD under `/medical-history` |
| Reviews | CRUD under `/reviews` |
| Notifications | `GET /notifications`, mark read, delete |

---

# 7 Doctor Routes — `/api/doctor`

All require token + **Doctor** role.

| Area | Paths |
|------|-------|
| Profile | `GET/PUT /profile`, `POST /upload-profile-image` |
| Clinics | `GET/POST /clinics`, `GET/PUT/DELETE /clinics/:id` |
| Slots | `GET/POST /clinics/:clinicId/slots`, `PUT/DELETE .../slots/:slotId` |
| Dashboard | `GET /dashboard` |
| Patient history | `GET /patients/:patientId/history` |
| Notifications | `GET /notifications`, mark read, delete |

---

# 8 Admin Routes — `/api/admin`

All require token + **Admin** role.

| Area | Paths |
|------|-------|
| Users | `GET /users`, `GET/PUT/DELETE /users/:id`, `PUT /users/:id/activate` |
| Pending | `GET /doctors/pending`, `PUT /doctors/:id/verify`, same for clinics |
| Analytics | `GET /analytics`, `GET /reports/appointments`, `GET /reports/users` |
| Complaints | CRUD + `PUT /complaints/:id/resolve` |

---

# 9 Chat Routes — `/api/chat`

Require token + **Patient** or **Doctor**.

| Method | Path | Use |
|--------|------|-----|
| GET | `/api/chat/conversations` | List conversations |
| GET | `/api/chat/history/:otherUserId` | Messages with one user |
| POST | `/api/chat/send` | Send a message |

---
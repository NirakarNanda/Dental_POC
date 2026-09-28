# PearlSmile Dental Studio — POC

Full-stack demo POC for a dental clinic: **Next.js frontend** + **Express/MongoDB backend**,
session-cookie doctor auth, patient CRUD, dashboard.

## Demo credentials

- Email: `doctor@pearlsmile.dental`
- Password: `demo1234`

(Seeded by `npm run seed` in `backend/`. This is a demo-only credential, not a real secret.)

## Quick start (demo runs offline — no Atlas needed)

```bash
# 1. Backend (port 5000)
cd backend
npm install
npm run seed     # creates demo doctor + 12 patients (works without MONGODB_URI)
npm run dev

# 2. Frontend (port 3000) — start AFTER the backend
cd ../frontend
npm install
npm run dev
```

Then open http://localhost:3000 — log in at **/login** with the demo credentials,
explore **/dashboard** and **/patients**.

The backend runs in **offline mode** when `MONGODB_URI` is unset: data lives in an
in-memory store persisted to `backend/data/db.json` (gitignored), so the demo works
end-to-end with zero configuration.

## Real MongoDB (optional)

Copy `backend/.env.example` to `backend/.env` and set:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
SESSION_SECRET=<random-string>
```

Then restart the backend and run `npm run seed` to seed the doctor + patients into Atlas.

## Project layout

```
frontend/   Next.js 16 + React 19 + Tailwind v4
  app/      / (landing)  /login  /dashboard  /patients
  lib/      api.ts (NEXT_PUBLIC_API_URL, default http://localhost:5000), auth hooks
  components/ Logo (SVG tooth mark), Navbar, Footer, AppShell, PatientModal, Toast, Reveal

backend/    Express + TypeScript
  src/      index.ts, config.ts, types.ts
  src/db/   mongoRepo.ts / jsonRepo.ts  (repository interface, offline-first)
  src/routes/ auth.ts, patients.ts, appointments.ts
  src/      seed.ts  (idempotent: doctor + 12 patients, 5 with visits today)
```

## API contract

- `POST /api/auth/login {email,password}` → `{ok, user}` (session cookie)
- `GET /api/auth/me` → `{ok, user}` / 401
- `POST /api/auth/logout`
- `GET /api/patients?search=&status=` → `{patients:[...]}` (auth required)
- `POST /api/patients` · `PUT /api/patients/:id` · `DELETE /api/patients/:id`
- `GET /api/appointments/today` → `{appointments:[{id, patientName, time, treatment, status}]}`

Patient fields: `name, age, phone, email?, treatment, status (active|completed|follow-up), nextVisit, notes`.

## Notes

- CORS in dev reflects any `http://localhost:<port>` / `127.0.0.1` origin with credentials.
- `express-session` uses the default in-memory session store — fine for the demo; swap in a Mongo store for production.
- Dashboard revenue figures and the weekly chart are client-side estimates from patient data — wire to real analytics later.

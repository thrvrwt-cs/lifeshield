# LifeShield — Full-Stack Health & Wellness Dashboard

This package contains the LifeShield React + TypeScript dashboard and a Spring Boot REST API backed by PostgreSQL. The existing dashboard screens are preserved. Browser `localStorage` keeps the app usable when the API is offline; when the API is available, profile, daily log, weekly history, vaccines, reminders, and assessment history are synced to PostgreSQL.

> **Educational project only.** This is not a medical device and does not provide diagnosis, treatment, or emergency dispatch. Do not enter real sensitive medical data into a demo deployment.

## Requirements
- Node.js 20+ and npm
- Java 21+
- PostgreSQL 15+ (PostgreSQL 18 is also fine)
- Maven 3.9+ (or use your IDE's Maven support)

## 1. Create the database
In pgAdmin, connect to your local PostgreSQL server and run:

```sql
CREATE DATABASE lifeshield_db;
```

Then connect to `lifeshield_db` and optionally run `database/schema.sql`. Spring Boot can also create/update the `app_state` table automatically on startup.

## 2. Configure the database password securely
Do not put your real password into source files or commit it to Git. Set it in the terminal that will run the backend.

**Windows Command Prompt (for the current terminal only):**

```bat
set DB_URL=jdbc:postgresql://localhost:5432/lifeshield_db
set DB_USERNAME=postgres
set DB_PASSWORD=YOUR_POSTGRES_PASSWORD
cd backend
mvn spring-boot:run
```

**PowerShell:**

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/lifeshield_db"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="YOUR_POSTGRES_PASSWORD"
cd backend
mvn spring-boot:run
```

Replace `YOUR_POSTGRES_PASSWORD` with the password you set privately in pgAdmin. The default placeholder `change-me` will not connect unless that is genuinely your database password. Backend API starts at `http://localhost:8080`.

## 3. Run the frontend
Open a second terminal:

```bat
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:3000`). The frontend calls `http://localhost:8080/api` by default. To change it, create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Restart Vite after changing environment variables.

## 4. Check that the backend is running
Open `http://localhost:8080/api/health`. It should return JSON containing `"status":"UP"`.

The authentication endpoints are `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout`. Registration and login establish a server-side session cookie; logout invalidates that session and returns the UI to the login/register screen. Passwords are stored as BCrypt hashes.

The API endpoints are:
- `GET /api/health` — health check
- `POST /api/auth/register` — create an account in PostgreSQL
- `POST /api/auth/login` — authenticate an existing account
- `GET /api/auth/me` — check the current session
- `POST /api/auth/logout` — invalidate the current session
- `GET /api/state` — all saved dashboard state
- `GET /api/state/{key}` — one saved state key
- `PUT /api/state/{key}` — save state (JSON body: `{"payload":"...serialized JSON..."}`)
- `DELETE /api/state/{key}` — delete a saved state key

Only the six expected LifeShield state keys are accepted. The API includes demo email/password registration and login, BCrypt password hashing, server-side sessions, and per-user dashboard state. This is an educational demo, not a security-audited production authentication system. Do not expose it publicly or enter real sensitive medical data.

## Project structure
- `frontend/` — React, TypeScript, Vite, dashboard UI
- `backend/` — Spring Boot REST API and JPA persistence
- `database/schema.sql` — optional SQL schema
- `start-frontend.bat` / `start-backend.bat` — convenience launchers (configure `DB_PASSWORD` first)

## Verification notes
The code package was inspected for its project structure and configuration. Runtime verification depends on installing npm/Maven dependencies and connecting to a PostgreSQL instance on your own machine; those environment-dependent checks must be completed locally. See `CHECKLIST.md` before presenting.

## 5. Accounts and user-specific data
- Start the backend before using the login page.
- Register with a valid email and a password of at least 8 characters.
- Passwords are stored as BCrypt hashes; the plain password is not stored.
- The browser uses a server-side session cookie for authenticated API requests.
- Dashboard state is saved per account in PostgreSQL's `user_state` table.
- `app_users` and `user_state` are created by Hibernate on backend startup (`ddl-auto=update`) or by `database/schema.sql`.
- This is a local educational implementation; use HTTPS, stronger deployment/session settings, rate limiting, and security review before any public deployment.

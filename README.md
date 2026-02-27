# Kodflix

A secured full-stack app with **registration and login**, and a **Netflix-style dashboard** that fetches movie data from [The Movie Database (TMDB)](https://www.themoviedb.org/). Only logged-in users can access the dashboard.

## Features

- **Authentication:** Signup (username, email, phone, password) → Login → JWT stored in HTTP-only cookie
- **Protected dashboard:** Netflix-style UI with hero banner, movie rows (Trending, Popular, Now in Theaters, Top Rated)
- **Backend:** Express + SQLite, bcrypt password hashing, JWT in cookie

## Setup

### 1. TMDB API key

Create a `.env` file in the **project root** (frontend) with:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Get a free key at [TMDB API](https://www.themoviedb.org/settings/api).

### 2. Frontend

```bash
cd c:\Users\karee\Desktop\Kodflix
npm install
```

### 3. Backend

```bash
cd backend
npm install
```

Optional: create `backend/.env` for production:

```
PORT=3001
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## Run the app

**Terminal 1 – Backend**

```bash
cd backend
npm run dev
```

Backend runs at **http://localhost:3001**.

**Terminal 2 – Frontend**

```bash
cd c:\Users\karee\Desktop\Kodflix
npm run dev
```

Frontend runs at **http://localhost:5173**. The Vite dev server proxies `/api` to the backend.

1. **First page:** Open **http://localhost:5173** (or kodflix-puce.vercel.app) → **Sign up** (`/`).
2. **Second page:** After signup you are redirected to **Login** (`/login`). Log in with username and password.
3. **Third page:** After login you are redirected to the **Dashboard** (`/dashboard` – Netflix-style hero + movie rows). Use **Log out** in the header to sign out.

**Routes:** `/` = Sign up (first), `/login` = Login (second), `/dashboard` = Dashboard (third, protected).

## Project structure

- **Frontend:** `src/` – Signup, Login, protected Dashboard, AuthContext, TMDB API client
- **Backend:** `backend/` – Express, SQLite (`users` table), `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` (JWT in HTTP-only cookie)

## Troubleshooting

**Port 3001 already in use (EADDRINUSE)**

1. Find the process using the port (PowerShell):
   ```powershell
   netstat -ano | findstr :3001
   ```
   Note the last number (PID), e.g. `6352`.

2. Stop that process (replace `6352` with your PID):
   ```powershell
   taskkill /PID 6352 /F
   ```

3. Start the backend again:
   ```powershell
   cd c:\Users\karee\Desktop\Kodflix\backend
   npm run dev
   ```

**Use a different port (e.g. 3002)**  
In PowerShell, set the port then run (no extra `cd backend` if you’re already in `backend`):
```powershell
$env:PORT="3002"
npm run dev
```
Then in `vite.config.js` change the proxy target to `http://localhost:3002` if the frontend must talk to this port.

## Deployment

- **Frontend (Vercel/Netlify):** Set `VITE_TMDB_API_KEY` and `VITE_API_URL` (your backend URL) in environment variables.
- **Backend:** Deploy the `backend/` folder (e.g. Railway, Render, Fly.io). Set `CORS_ORIGIN` to your frontend URL and `JWT_SECRET` for production.

## Tech

- React 19 + Vite 7 + React Router
- Express, SQLite (better-sqlite3), bcryptjs, jsonwebtoken, cookie-parser, cors
- TMDB API: trending, popular, now playing, top rated

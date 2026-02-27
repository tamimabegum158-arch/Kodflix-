# Deploying Kodflix Safely (GitHub + Vercel)

This guide follows the **golden rules**: never push secrets, always use environment variables, test locally before deploying.

---

## The biggest risk

If you push to GitHub with any of these **inside your code**, they become public:

- API keys (e.g. TMDB)
- Database passwords
- JWT secret

**Never hardcode these.** Use environment variables only.

---

## 1. Remove hardcoded secrets (already done in this project)

- **Backend:** Uses `process.env.JWT_SECRET`, `process.env.CORS_ORIGIN`, `process.env.PORT`. No secrets in code. In production, `JWT_SECRET` must be set (no fallback).
- **Frontend:** Uses `import.meta.env.VITE_TMDB_API_KEY` and `import.meta.env.VITE_API_URL`. No keys in code.
- **Database:** This repo uses SQLite (file) for simplicity. For production with a hosted backend, use a cloud DB (e.g. Aiven MySQL) and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in the backend; you would then change `backend/db.js` to use MySQL instead of SQLite.

---

## 2. Use .env files (never commit them)

**Root (frontend) – `.env`** (create from `.env.example`):

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
# For production build, set your deployed backend URL:
# VITE_API_URL=https://your-backend.vercel.app
```

**Backend – `backend/.env`** (create from `backend/.env.example`):

```env
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
CORS_ORIGIN=http://localhost:5173
```

For production, set `CORS_ORIGIN` to your frontend URL (e.g. `https://your-frontend.vercel.app`).

---

## 3. .gitignore (critical)

**Root `.gitignore`** already includes:

- `node_modules`
- `.env`
- `.env.local`
- `.env.*.local`
- `backend/kodflix.db` (and `*.db` in backend)

**Backend `backend/.gitignore`** includes:

- `node_modules`
- `.env`
- `*.db`

So Git will **not** push `.env` or database files to GitHub.

---

## 4. Test locally before pushing

1. **Backend:** `cd backend` → `npm install` → `npm run dev` (should see “Kodflix backend running on http://localhost:3001”).
2. **Frontend:** From project root → `npm install` → `npm run dev` (open http://localhost:5173).
3. **Check:** Register → Login → Dashboard loads and TMDB data (movies) appear.
4. Do **not** push if anything is broken.

---

## 5. Push to GitHub

**Option A – Single repo (this project layout)**

From project root:

```bash
git init
git add .
git commit -m "Kodflix frontend and backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Kodflix.git
git push -u origin main
```

**Option B – Separate repos**

- **Frontend repo:** Only frontend files (no `backend/`), or use a monorepo tool.
- **Backend repo:** Only `backend/` folder.  
Then push each to its own `origin` and deploy each separately.

---

## 6. Deploy backend

**Note:** This backend uses **SQLite** (file-based). On **Vercel** (serverless), the filesystem is not persistent, so SQLite is not suitable. For production you typically:

- Use **Vercel** with a **hosted database** (e.g. Aiven MySQL, PlanetScale) and set DB env vars, **or**
- Deploy the backend to **Railway**, **Render**, or **Fly.io** so you can keep SQLite or attach a DB.

**If you deploy backend to Vercel (with a cloud DB later):**

1. Vercel → Add New Project → Import your repo.
2. Set **Root Directory** to `backend`.
3. **Build command:** `npm install` (or leave default).
4. **Output directory:** leave default or as required for Node server.

**Environment variables (Vercel → Project → Settings → Environment Variables):**

| Name         | Value                    | Notes                    |
|-------------|---------------------------|---------------------------|
| `JWT_SECRET` | (strong random string)    | **Required in production** |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | Your frontend URL        |

If you switch to MySQL (e.g. Aiven):

| Name          | Value        |
|---------------|--------------|
| `DB_HOST`     | Aiven host   |
| `DB_USER`     | Aiven user   |
| `DB_PASSWORD` | Aiven password |
| `DB_NAME`     | Database name |

After saving env vars, **redeploy**. Backend URL will be like: `https://your-backend.vercel.app`.

---

## 7. Deploy frontend to Vercel

1. Vercel → Add New Project → Import the **same** repo (or your frontend-only repo).
2. **Root Directory:** leave as root (frontend is at project root).
3. **Build command:** `npm run build` (already in `vercel.json`).
4. **Output directory:** `dist` (Vite output).

**Environment variables:**

| Name                 | Value                        |
|----------------------|------------------------------|
| `VITE_TMDB_API_KEY`  | Your TMDB API key            |
| `VITE_API_URL`       | `https://your-backend.vercel.app` (no trailing slash) |

5. Deploy. Frontend URL will be like: `https://your-frontend.vercel.app`.

**Important:** After changing any environment variable (frontend or backend), **redeploy** that project.

---

## 8. Production flow

1. User opens **frontend** URL.
2. **Signup** → request goes to **backend** → user stored (DB).
3. **Login** → backend verifies → **JWT** created → stored in **HTTP-only cookie**.
4. **Dashboard** → frontend calls TMDB (using `VITE_TMDB_API_KEY`) and backend for auth; movies and UI load from the cloud.

---

## 9. Golden rules

- **Never** push secrets to GitHub (use `.env` and `.gitignore`).
- **Always** use environment variables for API keys, DB credentials, JWT secret.
- **Always** test locally before pushing.
- **Always** redeploy after changing environment variables.
- If something breaks in production, check browser console and network tab; confirm env vars are set and backend URL is correct.

---

## 10. This project – checklist

| Check | Status |
|-------|--------|
| No API key in frontend/backend code | ✅ Uses `VITE_TMDB_API_KEY`, `process.env.JWT_SECRET` |
| No DB password in code | ✅ SQLite file; for MySQL you’d use `process.env.DB_*` |
| No JWT secret hardcoded in production | ✅ Production requires `JWT_SECRET` env var |
| `.gitignore` excludes `.env` | ✅ Root and `backend/.gitignore` |
| Frontend env example | ✅ `.env.example` (VITE_*) |
| Backend env example | ✅ `backend/.env.example` |
| Frontend build | ✅ `npm run build` → `dist` |
| Backend run | ✅ `npm run dev` in `backend/` |

Building the app is only part of the work; pushing without exposing secrets and deploying with correct env vars is what makes you production-ready.

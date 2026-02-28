# Fix "Failed to fetch" after deploy (Frontend Vercel + Backend Render)

"Failed to fetch" means the **frontend cannot reach the backend**. Do these in order.

---

## 1. Set backend URL on Vercel (most common fix)

Your **frontend** must know where the backend is.

1. Open **https://vercel.com** → your **frontend** project (Kodflix).
2. Go to **Settings** → **Environment Variables**.
3. Add or edit:
   - **Name:** `VITE_API_URL`
   - **Value:** your **Render backend URL**, for example:  
     `https://kodflix-backend.onrender.com`  
   - Use **https**, no space, **no slash at the end**.
4. Save. Then go to **Deployments** → **⋯** on latest → **Redeploy** (so the new value is used).

---

## 2. Check backend is live on Render

1. Open **https://render.com** → your backend service.
2. Status should be **Live** (not "Suspended" or "Failed").
3. Open the backend URL in a new tab, e.g. `https://your-backend.onrender.com/api/health`  
   You should see: `{"ok":true}`.  
   If it doesn’t load, the backend is down or sleeping (free tier sleeps after ~15 min; first request may be slow).

---

## 3. Push latest code and redeploy backend

CORS was updated so the backend accepts requests from your Vercel frontend.

1. Commit and push:
   ```bash
   git add backend/server.js src/api/auth.js
   git commit -m "Fix CORS and Failed to fetch error message"
   git push
   ```
2. On **Render**, the backend will redeploy from the new push (or click **Manual Deploy**).

---

## 4. Try again

Open your **Vercel frontend URL**, try **Sign up** again.

- If **VITE_API_URL** was missing and you set it and redeployed → the error should go away.
- If you still see an error, the app may now show: *"Cannot reach backend. On Vercel: set VITE_API_URL to your Render backend URL and redeploy."*  
  That means: set **VITE_API_URL** on Vercel to your Render URL and redeploy the frontend.

---

## Quick checklist

| Where   | What to check |
|--------|----------------|
| Vercel | `VITE_API_URL` = `https://your-backend.onrender.com` (your real Render URL), then **Redeploy** |
| Render | Backend service is **Live**, and `https://your-backend.onrender.com/api/health` returns `{"ok":true}` |
| Both   | After changing env or code, **redeploy** the right project |

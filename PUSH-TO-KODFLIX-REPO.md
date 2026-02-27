# Push Kodflix to https://github.com/tamimabegum158-arch/Kodflix-.git

**Target repo:** `Kodflix-` (with hyphen) – [GitHub link](https://github.com/tamimabegum158-arch/Kodflix-.git)

**Type of push:** First push to an **empty** GitHub repo. You will push the `main` branch and set it as upstream.

---

## Requirements before push (must be satisfied)

| Requirement | Check |
|-------------|--------|
| **No secrets in Git** | `.env` is in `.gitignore` – never commit it |
| **No node_modules** | `node_modules` is in `.gitignore` |
| **No backend DB file** | `backend/*.db` is in `.gitignore` |
| **Run from project root** | All commands from `c:\Users\karee\Desktop\Kodflix` |

---

## Step-by-step (careful order)

### Step 1: Open project root

```powershell
cd c:\Users\karee\Desktop\Kodflix
```

### Step 2: Confirm .env is not staged

```powershell
git status
```

- You must **not** see `.env` in the list of files to be committed.
- If `.env` appears, do **not** run `git add .` until it is removed from staging and ignored.

### Step 3: See current remote

```powershell
git remote -v
```

- If you see `origin` pointing to `Kodflix.git` (without hyphen), you will **change** it to `Kodflix-.git` in the next step.
- If you see `origin` already pointing to `Kodflix-.git`, skip Step 4.

### Step 4: Point origin to the Kodflix- repo

**Option A – Change existing origin to Kodflix-**

```powershell
git remote set-url origin https://github.com/tamimabegum158-arch/Kodflix-.git
```

**Option B – If you prefer a new remote name (e.g. kodflix-minus)**

```powershell
git remote add kodflix-minus https://github.com/tamimabegum158-arch/Kodflix-.git
```

Then use `kodflix-minus` instead of `origin` in Step 6 (e.g. `git push -u kodflix-minus main`).

### Step 5: Confirm remote URL

```powershell
git remote -v
```

You should see:

- `origin  https://github.com/tamimabegum158-arch/Kodflix-.git  (fetch)`
- `origin  https://github.com/tamimabegum158-arch/Kodflix-.git  (push)`

(Or the same URL under `kodflix-minus` if you used Option B.)

### Step 6: Push to Kodflix- repo

**If using `origin`:**

```powershell
git push -u origin main
```

**If using another remote name (e.g. `kodflix-minus`):**

```powershell
git push -u kodflix-minus main
```

- First time may ask for GitHub login (username + Personal Access Token).
- After this, your code will be on: https://github.com/tamimabegum158-arch/Kodflix-

### Step 7: Verify on GitHub

1. Open: https://github.com/tamimabegum158-arch/Kodflix-
2. You should see: `backend/`, `src/`, `package.json`, `index.html`, etc.
3. **Important:** There must be **no** `.env` file visible. If `.env` is there, it was committed by mistake; fix locally and force-push (see below).

---

## If you still have uncommitted changes

Before Step 6, you can commit and then push:

```powershell
git add .
git status
```

Check again that `.env` is **not** in the list. Then:

```powershell
git commit -m "Kodflix: frontend and backend"
git push -u origin main
```

---

## Summary – exact commands for Kodflix- repo

| Step | Command |
|------|--------|
| 1 | `cd c:\Users\karee\Desktop\Kodflix` |
| 2 | `git status` (ensure .env not listed) |
| 3 | `git remote -v` |
| 4 | `git remote set-url origin https://github.com/tamimabegum158-arch/Kodflix-.git` |
| 5 | `git remote -v` (confirm URL) |
| 6 | `git push -u origin main` |

---

## Later: push more changes to Kodflix-

After editing code:

```powershell
cd c:\Users\karee\Desktop\Kodflix
git add .
git status
git commit -m "Describe changes"
git push
```

This is the careful, requirements-aware way to push to the **Kodflix-** repository.

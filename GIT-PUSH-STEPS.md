# How to Push Kodflix to GitHub – Step by Step

**Repo type:** One Git repository containing both **frontend** (root) and **backend** (inside `backend/` folder). You push the whole project from the **project root**.

---

## Before you start

1. **Never push secrets.** Your `.gitignore` already excludes `.env`. Do **not** remove `.env` from `.gitignore`.
2. **GitHub account** – You must have an account at [github.com](https://github.com).
3. **Git** – Installed on your PC ([git-scm.com](https://git-scm.com) if needed).

---

## Step 1: Open terminal in project root

Go to the Kodflix folder (the one that has both `backend` and `src`):

```text
c:\Users\karee\Desktop\Kodflix
```

Open PowerShell or Command Prompt and run:

```powershell
cd c:\Users\karee\Desktop\Kodflix
```

---

## Step 2: Check if Git is already initialized

Run:

```powershell
git status
```

- If you see **"fatal: not a git repository"** → go to **Step 3**.
- If you see a list of files or "nothing to commit" → Git is already set up; go to **Step 5** (and skip Step 3).

---

## Step 3: Initialize Git (only if Step 2 said "not a git repository")

Run:

```powershell
git init
```

This creates a new Git repo in `Kodflix`.

---

## Step 4: Add all files and make first commit

Run these two commands one by one:

```powershell
git add .
```

```powershell
git commit -m "Kodflix: frontend and backend"
```

- `git add .` adds all files (respecting `.gitignore`, so `.env` and `node_modules` are **not** added).
- `git commit` saves that snapshot with the message you gave.

---

## Step 5: Create a new repository on GitHub

1. Open [github.com](https://github.com) and sign in.
2. Click the **+** (top right) → **New repository**.
3. **Repository name:** e.g. `Kodflix` (or `kodflix`).
4. **Public** or **Private** – your choice.
5. Do **not** tick "Add a README" or "Add .gitignore" (you already have files).
6. Click **Create repository**.

---

## Step 6: Connect your folder to GitHub and push

GitHub will show commands; use these (replace `YOUR_USERNAME` and `Kodflix` with your GitHub username and repo name):

**Rename branch to main (if needed):**

```powershell
git branch -M main
```

**Add GitHub as remote:**

```powershell
git remote add origin https://github.com/YOUR_USERNAME/Kodflix.git
```

Example: if your username is `johndoe`, then:

```powershell
git remote add origin https://github.com/johndoe/Kodflix.git
```

**Push to GitHub:**

```powershell
git push -u origin main
```

- If GitHub asks for login, use your GitHub username and a **Personal Access Token** (not your normal password).  
  Create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token**.

---

## Step 7: Confirm on GitHub

1. Refresh your repository page on GitHub.
2. You should see folders like `backend`, `src`, and files like `package.json`, `index.html`, etc.
3. **Check:** There must be **no** `.env` file in the list. If you see `.env`, it was not ignored; remove it from the repo and fix `.gitignore` before pushing again.

---

## Summary – order of commands

| Step | Command |
|------|---------|
| 1 | `cd c:\Users\karee\Desktop\Kodflix` |
| 2 | `git status` (check if repo exists) |
| 3 | `git init` (only if no repo yet) |
| 4a | `git add .` |
| 4b | `git commit -m "Kodflix: frontend and backend"` |
| 5 | Create repo on GitHub (website) |
| 6a | `git branch -M main` |
| 6b | `git remote add origin https://github.com/YOUR_USERNAME/Kodflix.git` |
| 6c | `git push -u origin main` |

---

## Later: push new changes

After you change code:

```powershell
cd c:\Users\karee\Desktop\Kodflix
git add .
git commit -m "Short description of what you changed"
git push
```

---

## If you already have a remote and only want to push

If `git remote -v` already shows `origin` pointing to GitHub:

```powershell
git add .
git commit -m "Your message"
git push -u origin main
```

That’s the full step-by-step way to push this project to Git (GitHub).

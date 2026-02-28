const API_BASE = import.meta.env.VITE_API_URL || '';

function getCredentials() {
  return { credentials: 'include' };
}

export async function register({ username, email, phone, password }) {
  const url = `${API_BASE}/api/auth/register`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...getCredentials(),
      body: JSON.stringify({ username, email, phone, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error(
        'Cannot reach backend. On Vercel: set VITE_API_URL to your Render backend URL (e.g. https://kodflix-backend.onrender.com) and redeploy.'
      );
    }
    throw err;
  }
}

export async function login({ username, password }) {
  const url = `${API_BASE}/api/auth/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...getCredentials(),
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error(
        'Cannot reach backend. On Vercel: set VITE_API_URL to your Render backend URL and redeploy.'
      );
    }
    throw err;
  }
}

export async function logout() {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    ...getCredentials(),
  });
}

export async function getMe() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    ...getCredentials(),
  });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data.user ?? null;
}

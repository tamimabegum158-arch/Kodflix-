const API_BASE = import.meta.env.VITE_API_URL || '';

function getCredentials() {
  return { credentials: 'include' };
}

export async function register({ username, email, phone, password }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...getCredentials(),
    body: JSON.stringify({ username, email, phone, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login({ username, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...getCredentials(),
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
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

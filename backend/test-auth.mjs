/**
 * Quick verification: backend auth endpoints (run with: node test-auth.mjs)
 * Requires backend to be running: npm run dev (in backend folder)
 */
const BASE = 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  console.log('1. Health check...');
  const health = await request('/api/health');
  if (!health.ok) {
    console.error('Backend not running or failed:', health.status);
    process.exit(1);
  }
  console.log('   OK', health.data);

  console.log('2. Register...');
  const reg = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: 'verifyuser',
      email: 'verify@test.com',
      phone: '123',
      password: 'pass1234',
    }),
  });
  if (!reg.ok && reg.data?.error?.includes('already exists')) {
    console.log('   User already exists (OK for re-run)');
  } else if (!reg.ok) {
    console.error('   FAIL', reg.status, reg.data);
    process.exit(1);
  } else {
    console.log('   OK', reg.data?.message || reg.data);
  }

  console.log('3. Login (get cookie from response)...');
  const loginRes = await fetch(BASE + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'verifyuser', password: 'pass1234' }),
  });
  const loginData = await loginRes.json().catch(() => ({}));
  if (!loginRes.ok) {
    console.error('   FAIL', loginRes.status, loginData);
    process.exit(1);
  }
  console.log('   OK', loginData?.message, loginData?.user);

  const setCookie = loginRes.headers.get('set-cookie');
  if (!setCookie || !setCookie.includes('token')) {
    console.log('   WARN: Set-Cookie (token) not in response');
  } else {
    console.log('   Cookie present in response');
  }

  const cookieHeader = setCookie ? setCookie.split(';')[0] : '';

  console.log('4. GET /api/auth/me (with cookie)...');
  const meRes = await fetch(BASE + '/api/auth/me', {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
  const meData = await meRes.json().catch(() => ({}));
  if (!meRes.ok) {
    console.error('   FAIL', meRes.status, meData);
    process.exit(1);
  }
  console.log('   OK', meData?.user);

  console.log('\nAll backend auth checks passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

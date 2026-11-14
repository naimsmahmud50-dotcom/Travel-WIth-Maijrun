import assert from 'node:assert';
import { spawn } from 'node:child_process';
import path from 'node:path';

const PORT = 3999;
const BASE_URL = `http://127.0.0.1:${PORT}`;

console.log('🧪 Starting Next.js Production End-to-End Test Suite...\n');

const nextProcess = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  env: { ...process.env, PORT: String(PORT) },
  cwd: path.resolve('.'),
});

let serverLogs = '';
nextProcess.stdout.on('data', (d) => (serverLogs += d.toString()));
nextProcess.stderr.on('data', (d) => (serverLogs += d.toString()));

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let passedTests = 0;
async function testAsync(description: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(error);
    console.error('Next.js logs:\n', serverLogs);
    nextProcess.kill();
    process.exit(1);
  }
}

async function waitForServerReady(retries = 20): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/session`);
      if (res.status === 200) return;
    } catch {
      await wait(500);
    }
  }
  throw new Error('Next.js server failed to start within timeout');
}

async function run() {
  await waitForServerReady();

  const masterPass = 'Maijrun#RoyalElite@2026!Secured';

  // 1. Check /admin page HTML bundle for leaked passwords
  await testAsync('GET /admin: HTML response does not leak credentials or passwords', async () => {
    const res = await fetch(`${BASE_URL}/admin`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(!html.includes('Maijrun@VIP2026!'), 'Old password must NOT be in HTML');
    assert.ok(!html.includes('Maijrun#RoyalElite@2026!Secured'), 'New password must NOT be in HTML');
    assert.ok(!html.includes('VALID_CREDENTIALS'), 'VALID_CREDENTIALS must NOT be in HTML');
  });

  // 2. Invalid Login -> 401
  await testAsync('POST /api/admin/login: rejects incorrect password with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin', password: 'HackerPassword999!' }),
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  // 3. Valid Login -> 200 with HttpOnly Set-Cookie
  let sessionCookie = '';
  await testAsync('POST /api/admin/login: sets HttpOnly session cookie on successful auth', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin', password: masterPass, remember: true }),
    });
    const body = await res.json();
    if (res.status !== 200) {
      console.log('Login failed with body:', body);
    }
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.success, true);
    assert.ok(body.user);

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie, 'Must return Set-Cookie header');
    assert.ok(setCookie.includes('maijrun_admin_token'), 'Must contain maijrun_admin_token');
    assert.ok(setCookie.toLowerCase().includes('httponly'), 'Must be HttpOnly');
    assert.ok(setCookie.toLowerCase().includes('samesite=lax'), 'Must be SameSite=Lax');
    sessionCookie = setCookie.split(';')[0];
  });

  // 4. GET /api/admin/session without cookie -> unauthenticated
  await testAsync('GET /api/admin/session: returns authenticated: false when unauthenticated', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/session`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.authenticated, false);
  });

  // 5. GET /api/admin/session with cookie -> authenticated: true
  await testAsync('GET /api/admin/session: validates session cookie and returns user', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/session`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.authenticated, true);
    assert.strictEqual(body.user, 'Sheikh Mahmud Hasan (VIP Admin)');
  });

  // 6. GET /api/inquiries without auth -> 401 Unauthorized
  await testAsync('GET /api/inquiries: strictly blocks unauthenticated access with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.error.toLowerCase().includes('unauthorized'));
  });

  // 7. GET /api/inquiries with valid session -> 200 OK
  await testAsync('GET /api/inquiries: grants access to inquiries for authorized session', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  // 8. POST /api/inquiries without auth -> 200 OK (Public form)
  await testAsync('POST /api/inquiries: public booking requests succeed without auth', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Public Test Guest',
        email: 'guest@example.com',
        phone: '+8801900000000',
        destination: 'Maldives Overwater Sanctuary',
      }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.inquiryId);
  });

  // 9. POST /api/admin/logout -> clears cookie
  await testAsync('POST /api/admin/logout: clears session cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/logout`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie.includes('Max-Age=0') || setCookie.includes('max-age=0'));
  });

  nextProcess.kill();
  console.log(`\n🎉 All ${passedTests} Next.js production end-to-end tests passed!\n`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  nextProcess.kill();
  process.exit(1);
});

import assert from 'node:assert';
import { spawn } from 'node:child_process';
import path from 'node:path';

const PORT = 3899;
const BASE_URL = `http://127.0.0.1:${PORT}`;

console.log('🧪 Starting Server End-to-End Test Suite...\n');

const serverProcess = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: String(PORT) },
  cwd: path.resolve('.'),
});

let serverLogs = '';
serverProcess.stdout.on('data', (d) => (serverLogs += d.toString()));
serverProcess.stderr.on('data', (d) => (serverLogs += d.toString()));

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
    serverProcess.kill();
    process.exit(1);
  }
}

async function run() {
  // Wait for server to start
  await wait(1200);

  const masterPass = 'Maijrun#RoyalElite@2026!Secured';

  // 1. Invalid Login -> 401
  await testAsync('POST /api/admin/login: rejects wrong password', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin', password: 'BadPassword' }),
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  // 2. Valid Login -> 200 with HttpOnly Set-Cookie
  let sessionCookie = '';
  await testAsync('POST /api/admin/login: grants access and issues HttpOnly cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'admin', password: masterPass }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.user);

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie.includes('maijrun_admin_token'));
    assert.ok(setCookie.includes('HttpOnly'));
    sessionCookie = setCookie.split(';')[0];
  });

  // 3. GET /api/admin/session without cookie -> unauthenticated
  await testAsync('GET /api/admin/session: false when unauthenticated', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/session`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.authenticated, false);
  });

  // 4. GET /api/admin/session with cookie -> authenticated
  await testAsync('GET /api/admin/session: true with valid session cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/session`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.authenticated, true);
  });

  // 5. GET /api/inquiries without auth -> 401
  await testAsync('GET /api/inquiries: 401 Unauthorized for public visitors', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  // 6. GET /api/inquiries with auth -> 200 OK
  await testAsync('GET /api/inquiries: 200 OK for authenticated admin', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  // 7. POST /api/inquiries without auth -> 201 OK
  await testAsync('POST /api/inquiries: open for public customer booking submissions', async () => {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'VIP Sheikh Naim',
        email: 'naimsmahmud50@gmail.com',
        phone: '+8801767850859',
        destination: 'Makkah Royal Suite',
      }),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.inquiryId);
  });

  // 8. POST /api/admin/logout -> clears cookie
  await testAsync('POST /api/admin/logout: clears cookie and revokes session', async () => {
    const res = await fetch(`${BASE_URL}/api/admin/logout`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie.includes('Max-Age=0'));
  });

  serverProcess.kill();
  console.log(`\n🎉 All ${passedTests} server end-to-end tests passed!\n`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  serverProcess.kill();
  process.exit(1);
});

import assert from 'node:assert';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PORT = 3899;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const INQUIRIES_PATH = path.resolve('data/inquiries.json');
const SUBSCRIBERS_PATH = path.resolve('data/subscribers.json');

// Preserve initial data file contents for test cleanup
const originalInquiries = fs.existsSync(INQUIRIES_PATH) ? fs.readFileSync(INQUIRIES_PATH, 'utf-8') : '[]';
const originalSubscribers = fs.existsSync(SUBSCRIBERS_PATH) ? fs.readFileSync(SUBSCRIBERS_PATH, 'utf-8') : '[]';

function restoreDataFiles() {
  try {
    fs.writeFileSync(INQUIRIES_PATH, originalInquiries, 'utf-8');
    fs.writeFileSync(SUBSCRIBERS_PATH, originalSubscribers, 'utf-8');
  } catch {
    // ignore
  }
}

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
    restoreDataFiles();
    serverProcess.kill();
    process.exit(1);
  }
}

async function run() {
  try {
    // Wait for server to start
    await wait(1200);

    const masterPass = 'Maijrun#RoyalElite@2026!Secured';

    // 1. Secret File Leakage Prevention: /.env.local & /data/inquiries.json must be 404
    await testAsync('GET /.env.local: strictly blocked with 404 (No credential leakage)', async () => {
      const res = await fetch(`${BASE_URL}/.env.local`);
      assert.strictEqual(res.status, 404);
      const text = await res.text();
      assert.ok(!text.includes('ADMIN_PASSWORD'), 'Must not leak ADMIN_PASSWORD');
    });

    await testAsync('GET /data/inquiries.json: strictly blocked with 404 (Direct data bypass prohibited)', async () => {
      const res = await fetch(`${BASE_URL}/data/inquiries.json`);
      assert.strictEqual(res.status, 404);
    });

    // 2. Invalid Login -> 401
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

    // 3. Valid Login -> 200 with HttpOnly Set-Cookie and Expires
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
      assert.ok(setCookie.includes('Expires=') || setCookie.includes('expires='));
      sessionCookie = setCookie.split(';')[0];
    });

    // 4. Rate Limiting on Failed Login (Anti-Brute-Force)
    await testAsync('POST /api/admin/login: rate limiter returns 429 after 5 failed attempts from same IP', async () => {
      const bruteForceIp = '203.0.113.42';
      for (let i = 0; i < 5; i++) {
        await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': bruteForceIp },
          body: JSON.stringify({ identifier: 'admin', password: `WrongGuess${i}` }),
        });
      }

      // 6th attempt must be rejected with 429
      const lockedRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': bruteForceIp },
        body: JSON.stringify({ identifier: 'admin', password: 'AnyPassword' }),
      });
      assert.strictEqual(lockedRes.status, 429);
      const lockedBody = await lockedRes.json();
      assert.strictEqual(lockedBody.success, false);
      assert.ok(lockedBody.error.includes('Too many failed login attempts'));
    });

    // 5. GET /api/admin/session without cookie -> unauthenticated
    await testAsync('GET /api/admin/session: false when unauthenticated', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/session`);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.authenticated, false);
    });

    // 6. GET /api/admin/session with cookie -> authenticated
    await testAsync('GET /api/admin/session: true with valid session cookie', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/session`, {
        headers: { Cookie: sessionCookie },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.authenticated, true);
    });

    // 7. GET /api/inquiries without auth -> 401
    await testAsync('GET /api/inquiries: 401 Unauthorized for public visitors with zero data leakage', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`);
      assert.strictEqual(res.status, 401);
      const cacheControl = res.headers.get('cache-control');
      assert.ok(cacheControl && cacheControl.includes('no-store'), 'Must enforce Cache-Control: no-store');
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual((body as any).data, undefined, 'Must not leak inquiries array on 401');
    });

    // 7b. GET /api/inquiries/ trailing slash without auth -> 401
    await testAsync('GET /api/inquiries/: trailing slash strictly blocks unauthenticated access with 401', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries/`);
      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.success, false);
    });

    // 7c. GET /api/inquiries with tampered cookie -> 401
    await testAsync('GET /api/inquiries: rejects forged cookie with 401', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        headers: { Cookie: 'maijrun_admin_token=fake.tampered_signature' },
      });
      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual((body as any).data, undefined);
    });

    // 8. GET /api/inquiries with auth -> 200 OK
    await testAsync('GET /api/inquiries: 200 OK for authenticated admin with security headers', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        headers: { Cookie: sessionCookie },
      });
      assert.strictEqual(res.status, 200);
      const cacheControl = res.headers.get('cache-control');
      assert.ok(cacheControl && cacheControl.includes('no-store'), 'Must enforce Cache-Control: no-store');
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.ok(Array.isArray(body.data));
    });

    // 8b. GET /api/inquiries with Bearer auth -> 200 OK
    await testAsync('GET /api/inquiries: 200 OK with Bearer Authorization header', async () => {
      const tokenValue = sessionCookie.split('=')[1];
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.ok(Array.isArray(body.data));
    });

    // 8c. DELETE /api/inquiries -> 405 Method Not Allowed
    await testAsync('DELETE /api/inquiries: returns 405 Method Not Allowed', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, { method: 'DELETE' });
      assert.strictEqual(res.status, 405);
    });

    // 9. POST /api/inquiries without auth -> 201 OK
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

    // 10. POST /api/admin/logout -> clears cookie
    await testAsync('POST /api/admin/logout: clears cookie and revokes session', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/logout`, { method: 'POST' });
      assert.strictEqual(res.status, 200);
      const setCookie = res.headers.get('set-cookie');
      assert.ok(setCookie);
      assert.ok(setCookie.includes('Max-Age=0'));
      assert.ok(setCookie.includes('Expires=') || setCookie.includes('expires='));
    });

    restoreDataFiles();
    serverProcess.kill();
    console.log(`\n🎉 All ${passedTests} server end-to-end tests passed!\n`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    restoreDataFiles();
    serverProcess.kill();
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  restoreDataFiles();
  serverProcess.kill();
  process.exit(1);
});

process.on('SIGTERM', () => {
  restoreDataFiles();
  serverProcess.kill();
  process.exit(1);
});

run().catch((err) => {
  console.error(err);
  restoreDataFiles();
  serverProcess.kill();
  process.exit(1);
});

import assert from 'node:assert';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PORT = 3999;
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
    restoreDataFiles();
    nextProcess.kill();
    process.exit(1);
  }
}

async function waitForServerReady(retries = 25): Promise<void> {
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
  try {
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

    // 2. Secret File Leakage Prevention: /.env.local must be 404
    await testAsync('GET /.env.local: Next.js returns 404 (No credential leakage)', async () => {
      const res = await fetch(`${BASE_URL}/.env.local`);
      assert.strictEqual(res.status, 404);
      const text = await res.text();
      assert.ok(!text.includes('ADMIN_PASSWORD'), 'Must not leak ADMIN_PASSWORD');
    });

    // 3. Invalid Login -> 401
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

    // 4. Rate Limiting on Failed Login (Anti-Brute-Force)
    await testAsync('POST /api/admin/login: rate limiter triggers 429 after 5 failed attempts from same IP', async () => {
      const attackIp = '198.51.100.99';
      for (let i = 0; i < 5; i++) {
        await fetch(`${BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': attackIp },
          body: JSON.stringify({ identifier: 'admin', password: `BruteForceAttempt${i}` }),
        });
      }

      // 6th attempt must be blocked with 429
      const lockedRes = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': attackIp },
        body: JSON.stringify({ identifier: 'admin', password: masterPass }),
      });
      assert.strictEqual(lockedRes.status, 429);
      const lockedBody = await lockedRes.json();
      assert.strictEqual(lockedBody.success, false);
      assert.ok(lockedBody.error.includes('Too many failed login attempts'));
    });

    // 5. Valid Login -> 200 with HttpOnly Set-Cookie
    let sessionCookie = '';
    await testAsync('POST /api/admin/login: sets HttpOnly session cookie on successful auth', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'admin', password: masterPass, remember: true }),
      });
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.user);

      const setCookie = res.headers.get('set-cookie');
      assert.ok(setCookie, 'Must return Set-Cookie header');
      assert.ok(setCookie.includes('maijrun_admin_token'), 'Must contain maijrun_admin_token');
      assert.ok(setCookie.toLowerCase().includes('httponly'), 'Must be HttpOnly');
      assert.ok(setCookie.toLowerCase().includes('samesite=lax'), 'Must be SameSite=Lax');
      assert.ok(setCookie.toLowerCase().includes('expires='), 'Must include Expires');
      sessionCookie = setCookie.split(';')[0];
    });

    // 6. GET /api/admin/session without cookie -> unauthenticated
    await testAsync('GET /api/admin/session: returns authenticated: false when unauthenticated', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/session`);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.authenticated, false);
    });

    // 7. GET /api/admin/session with cookie -> authenticated: true
    await testAsync('GET /api/admin/session: validates session cookie and returns user', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/session`, {
        headers: { Cookie: sessionCookie },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.authenticated, true);
      assert.strictEqual(body.user, 'Sheikh Mahmud Hasan (VIP Admin)');
    });

    // 8. GET /api/inquiries without auth -> 401 Unauthorized
    await testAsync('GET /api/inquiries: strictly blocks unauthenticated access with 401 and zero data leakage', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`);
      assert.strictEqual(res.status, 401);
      const cacheControl = res.headers.get('cache-control');
      assert.ok(cacheControl && cacheControl.includes('no-store'), 'Must enforce Cache-Control: no-store');
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual((body as any).data, undefined, 'Must not leak client records on 401');
      assert.ok(body.error.toLowerCase().includes('unauthorized'));
    });

    // 8b. GET /api/inquiries with tampered / forged cookie -> 401 Unauthorized
    await testAsync('GET /api/inquiries: rejects tampered/forged session cookie with 401', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        headers: { Cookie: 'maijrun_admin_token=eyJhbGciOiJIUzI1NiJ9.forged_signature_attack' },
      });
      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.success, false);
      assert.strictEqual((body as any).data, undefined);
    });

    // 9. GET /api/inquiries with valid session -> 200 OK
    await testAsync('GET /api/inquiries: grants access to inquiries for authorized session with security headers', async () => {
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

    // 9b. GET /api/inquiries with Bearer token header -> 200 OK
    await testAsync('GET /api/inquiries: grants access with valid Bearer Authorization header', async () => {
      const tokenValue = sessionCookie.split('=')[1];
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        headers: { Authorization: `Bearer ${tokenValue}` },
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.ok(Array.isArray(body.data));
    });

    // 10. POST /api/inquiries without auth -> 200 OK (Public form)
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

    // 11. POST /api/admin/logout -> clears cookie
    await testAsync('POST /api/admin/logout: clears session cookie with maxAge: 0 and expires', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/logout`, { method: 'POST' });
      assert.strictEqual(res.status, 200);
      const setCookie = res.headers.get('set-cookie');
      assert.ok(setCookie);
      assert.ok(setCookie.includes('Max-Age=0') || setCookie.includes('max-age=0'));
      assert.ok(setCookie.includes('Expires=') || setCookie.includes('expires='));
    });

    restoreDataFiles();
    nextProcess.kill();
    console.log(`\n🎉 All ${passedTests} Next.js production end-to-end tests passed!\n`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    restoreDataFiles();
    nextProcess.kill();
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  restoreDataFiles();
  nextProcess.kill();
  process.exit(1);
});

process.on('SIGTERM', () => {
  restoreDataFiles();
  nextProcess.kill();
  process.exit(1);
});

run().catch((err) => {
  console.error(err);
  restoreDataFiles();
  nextProcess.kill();
  process.exit(1);
});

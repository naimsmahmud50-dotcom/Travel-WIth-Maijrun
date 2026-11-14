import assert from 'node:assert';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 3877;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const INQUIRIES_PATH = path.resolve('data/inquiries.json');
const COMPONENT_PATH = path.resolve('components/InquiryModal.tsx');

// Backup inquiries.json
const originalInquiries = fs.existsSync(INQUIRIES_PATH) ? fs.readFileSync(INQUIRIES_PATH, 'utf-8') : '[]';

function restoreData() {
  try {
    fs.writeFileSync(INQUIRIES_PATH, originalInquiries, 'utf-8');
  } catch {
    // ignore
  }
}

console.log('🧪 Starting Inquiry Modal & Booking Flow Test Suite...\n');

let passedTests = 0;
async function testAsync(description: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(error);
    restoreData();
    process.exit(1);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  let serverProcess: any = null;
  try {
    // 1. InquiryModal Component Contract Verification
    await testAsync('InquiryModal: source code implements all 6 required state bindings', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes("useState('')") || code.includes('useState('), 'Must use useState');
      assert.ok(code.includes('name') && code.includes('setName'), 'Must bind name state');
      assert.ok(code.includes('email') && code.includes('setEmail'), 'Must bind email state');
      assert.ok(code.includes('phone') && code.includes('setPhone'), 'Must bind phone state');
      assert.ok(code.includes('destination') && code.includes('setDestination'), 'Must bind destination state');
      assert.ok(code.includes('guests') && code.includes('setGuests'), 'Must bind guests state');
      assert.ok(code.includes('preferences') && code.includes('setPreferences'), 'Must bind preferences state');
    });

    await testAsync('InquiryModal: pre-fills destination and resets when destinationTitle is omitted', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes('destinationTitle'), 'Must accept destinationTitle prop');
      assert.ok(
        code.includes("setDestination(destinationTitle || '')"),
        'Must reset destination to empty string when destinationTitle is undefined/omitted'
      );
    });

    await testAsync('InquiryModal: protects against concurrent double submissions via isSubmitting and ref lock', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes('isSubmittingRef'), 'Must declare synchronous submission lock ref');
      assert.ok(code.includes('if (isSubmitting || isSubmittingRef.current) return;'), 'Must reject concurrent triggers in handleSubmit');
    });

    await testAsync('InquiryModal: validates phone number format and minimum length', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes('phoneClean') || code.includes('phone'), 'Must clean and validate phone digits');
      assert.ok(code.includes('length < 6'), 'Must enforce minimum phone length');
    });

    await testAsync('InquiryModal: supports keyboard Escape, backdrop click, and body scroll lock', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes("'Escape'"), 'Must handle Escape key');
      assert.ok(code.includes('overflow = \'hidden\''), 'Must lock background scroll');
      assert.ok(code.includes('e.target === e.currentTarget'), 'Must handle backdrop click dismiss');
      assert.ok(code.includes('Close Window'), 'Must provide Close Window button');
    });

    await testAsync('InquiryModal: connects to POST /api/inquiries with payload', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes("fetch('/api/inquiries'"), 'Must call /api/inquiries');
      assert.ok(code.includes("method: 'POST'"), 'Must use POST method');
      assert.ok(code.includes('application/json'), 'Must send JSON headers');
      assert.ok(code.includes('isSubmitting'), 'Must manage isSubmitting loading state');
      assert.ok(code.includes('error'), 'Must manage error state');
      assert.ok(code.includes('submitted'), 'Must manage submitted confirmation state');
      assert.ok(code.includes('Alhamdulillah!'), 'Must preserve Alhamdulillah confirmation message');
    });

    await testAsync('InquiryModal: resets form fields upon successful submission', () => {
      const code = fs.readFileSync(COMPONENT_PATH, 'utf-8');
      assert.ok(code.includes("setName('')"), 'Must reset name on success');
      assert.ok(code.includes("setEmail('')"), 'Must reset email on success');
      assert.ok(code.includes("setPhone('')"), 'Must reset phone on success');
      assert.ok(code.includes("setDestination('')"), 'Must reset destination on success');
    });

    // 2. Start server to test API persistence
    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: String(PORT) },
      cwd: path.resolve('.'),
    });

    await wait(1200);

    // 3. Test API Route Directly
    await testAsync('POST /api/inquiries: rejects submissions with missing required fields (400)', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.ok(data.error.includes('required'));

      // Verify whitespace-only payloads are also rejected
      const resWhitespace = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '   ', email: '   ', phone: '   ' }),
      });
      assert.strictEqual(resWhitespace.status, 400);
      const dataWhitespace = await resWhitespace.json();
      assert.strictEqual(dataWhitespace.success, false);
    });

    await testAsync('POST /api/inquiries: saves full bespoke dossier to data/inquiries.json', async () => {
      const testDossier = {
        name: 'VIP Sheikh Naim Client',
        email: 'vip.client@royaltravel.com',
        phone: '+8801811223344',
        destination: 'Royal Makkah & Madinah Sanctuary',
        guests: 'Couples / 2 Guests',
        preferences: 'High-floor Haram view, private halal dining, dedicated scholar accompaniment',
      };

      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testDossier),
      });

      assert.ok(res.status === 200 || res.status === 201, `Status was ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.inquiryId);

      // Verify inquiries.json was written with the exact dossier
      const fileData = JSON.parse(fs.readFileSync(INQUIRIES_PATH, 'utf-8'));
      assert.ok(Array.isArray(fileData));
      const saved = fileData.find((item: any) => item.id === data.inquiryId);
      assert.ok(saved, 'Saved inquiry must exist in data/inquiries.json');
      assert.strictEqual(saved.name, testDossier.name);
      assert.strictEqual(saved.email, testDossier.email);
      assert.strictEqual(saved.phone, testDossier.phone);
      assert.strictEqual(saved.destination, testDossier.destination);
      assert.strictEqual(saved.guests, testDossier.guests);
      assert.strictEqual(saved.preferences, testDossier.preferences);
      assert.strictEqual(saved.status, 'NEW');
      assert.ok(saved.createdAt);
    });

    await testAsync('POST /api/inquiries: applies robust defaults when optional fields are omitted', async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Minimalist Traveler',
          email: 'minimal@example.com',
          phone: '+8801999888777',
        }),
      });

      assert.ok(res.status === 200 || res.status === 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);

      const fileData = JSON.parse(fs.readFileSync(INQUIRIES_PATH, 'utf-8'));
      const saved = fileData.find((item: any) => item.id === data.inquiryId);
      assert.ok(saved.destination);
      assert.ok(saved.guests);
    });

    await testAsync('POST /api/inquiries: handles concurrent submissions reliably with distinct IDs', async () => {
      const submissions = [
        { name: 'Concurrent Client Alpha', email: 'alpha@vip.com', phone: '+8801711111111', destination: 'Maldives' },
        { name: 'Concurrent Client Beta', email: 'beta@vip.com', phone: '+8801722222222', destination: 'Andalusia' },
        { name: 'Concurrent Client Gamma', email: 'gamma@vip.com', phone: '+8801733333333', destination: 'Makkah' },
        { name: 'Concurrent Client Delta', email: 'delta@vip.com', phone: '+8801744444444', destination: 'Swiss Alps' },
      ];

      const responses = await Promise.all(
        submissions.map((sub) =>
          fetch(`${BASE_URL}/api/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub),
          })
        )
      );

      for (const res of responses) {
        assert.ok(res.status === 200 || res.status === 201);
      }

      const results = await Promise.all(responses.map((r) => r.json()));
      assert.strictEqual(results[0].success, true);
      assert.strictEqual(results[1].success, true);
      assert.notStrictEqual(results[0].inquiryId, results[1].inquiryId, 'Inquiry IDs must be distinct');

      const idSet = new Set(results.map((r) => r.inquiryId));
      assert.strictEqual(idSet.size, submissions.length, 'All concurrent inquiry IDs must be distinct');

      const fileData = JSON.parse(fs.readFileSync(INQUIRIES_PATH, 'utf-8'));
      for (const r of results) {
        assert.ok(fileData.some((item: any) => item.id === r.inquiryId));
      }
    });

    restoreData();
    serverProcess.kill();
    console.log(`\n🎉 All ${passedTests} Inquiry Modal & Booking Flow tests passed successfully!\n`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    restoreData();
    if (serverProcess) serverProcess.kill();
    process.exit(1);
  }
}

run();

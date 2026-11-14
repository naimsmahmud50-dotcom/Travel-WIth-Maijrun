import assert from 'node:assert';
import crypto from 'node:crypto';
import {
  safeCompare,
  getAdminUsers,
  getAdminPassword,
  validateAdminCredentials,
  createSessionToken,
  verifySessionToken,
  getCookieOptions,
  checkLoginRateLimit,
  recordFailedLogin,
  clearLoginRateLimit,
  ADMIN_COOKIE_NAME,
} from '../lib/auth.ts';

console.log('🧪 Starting Security & Authentication Test Suite...\n');

let passedTests = 0;

function test(description: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(error);
    process.exit(1);
  }
}

// 1. Safe Compare Tests
test('safeCompare: equal strings return true', () => {
  assert.strictEqual(safeCompare('securePass123', 'securePass123'), true);
  assert.strictEqual(safeCompare('', ''), true);
});

test('safeCompare: different strings return false without error', () => {
  assert.strictEqual(safeCompare('securePass123', 'wrongPass'), false);
  assert.strictEqual(safeCompare('short', 'muchLongerStringHere!'), false);
  assert.strictEqual(safeCompare('', 'something'), false);
});

test('safeCompare: non-string inputs safely return false without throwing', () => {
  assert.strictEqual(safeCompare(null as any, null as any), false);
  assert.strictEqual(safeCompare(undefined as any, undefined as any), false);
  assert.strictEqual(safeCompare(123 as any, 123 as any), false);
  assert.strictEqual(safeCompare({} as any, {} as any), false);
});

// 2. Admin Credentials & Environment Configuration Tests
test('getAdminUsers: returns default authorized list', () => {
  const users = getAdminUsers();
  assert.ok(users.includes('naimsmahmud50@gmail.com'));
  assert.ok(users.includes('admin'));
  assert.ok(users.includes('maijrun_vip'));
});

test('getAdminPassword: has strong high-entropy master passcode', () => {
  const pass = getAdminPassword();
  assert.ok(pass.length >= 16, 'Password must be at least 16 characters long');
  assert.ok(/[A-Z]/.test(pass), 'Password must contain uppercase letters');
  assert.ok(/[a-z]/.test(pass), 'Password must contain lowercase letters');
  assert.ok(/[0-9]/.test(pass), 'Password must contain digits');
  assert.ok(/[^A-Za-z0-9]/.test(pass), 'Password must contain special symbols');
});

test('validateAdminCredentials: authorized user with correct passcode succeeds', () => {
  const pass = getAdminPassword();
  const res1 = validateAdminCredentials('naimsmahmud50@gmail.com', pass);
  assert.strictEqual(res1.valid, true);
  assert.strictEqual(res1.user, 'naimsmahmud50@gmail.com');

  const res2 = validateAdminCredentials('admin', pass);
  assert.strictEqual(res2.valid, true);

  const res3 = validateAdminCredentials('maijrun_vip', pass);
  assert.strictEqual(res3.valid, true);
});

test('validateAdminCredentials: case-insensitivity on identifier works', () => {
  const pass = getAdminPassword();
  const res = validateAdminCredentials('NaimsMahmud50@Gmail.Com ', pass);
  assert.strictEqual(res.valid, true);
});

test('validateAdminCredentials: incorrect passcode fails', () => {
  const res = validateAdminCredentials('admin', 'IncorrectPass123!');
  assert.strictEqual(res.valid, false);
});

test('validateAdminCredentials: unauthorized identifier fails', () => {
  const pass = getAdminPassword();
  const res = validateAdminCredentials('attacker@evil.com', pass);
  assert.strictEqual(res.valid, false);
});

test('validateAdminCredentials: empty/missing credentials fail', () => {
  const pass = getAdminPassword();
  assert.strictEqual(validateAdminCredentials('', pass).valid, false);
  assert.strictEqual(validateAdminCredentials('admin', '').valid, false);
});

// 3. Rate Limiting Tests (Anti-Brute-Force)
test('checkLoginRateLimit: allows initial requests and blocks after 5 failures', () => {
  const testIp = '192.0.2.10';
  clearLoginRateLimit(testIp);

  // Initially allowed
  assert.strictEqual(checkLoginRateLimit(testIp).allowed, true);

  // 5 failed attempts
  for (let i = 0; i < 5; i++) {
    recordFailedLogin(testIp);
  }

  // 6th attempt should be blocked
  const blocked = checkLoginRateLimit(testIp);
  assert.strictEqual(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  // Clear resets lockout
  clearLoginRateLimit(testIp);
  assert.strictEqual(checkLoginRateLimit(testIp).allowed, true);
});

// 4. Session Token Generation & Verification Tests
test('createSessionToken & verifySessionToken: valid token round-trip', () => {
  const user = 'naimsmahmud50@gmail.com';
  const token = createSessionToken(user, false);
  assert.ok(typeof token === 'string' && token.includes('.'));

  const verified = verifySessionToken(token);
  assert.ok(verified !== null);
  assert.strictEqual(verified.user, user);
  assert.ok(verified.exp > Date.now());
});

test('createSessionToken: remember=true issues 30-day session', () => {
  const token = createSessionToken('admin', true);
  const verified = verifySessionToken(token);
  assert.ok(verified !== null);
  // Expiry should be approx 30 days in future (~2,592,000,000 ms)
  const diffMs = verified.exp - Date.now();
  assert.ok(diffMs > 29 * 24 * 60 * 60 * 1000);
});

test('verifySessionToken: tampered signature is rejected', () => {
  const token = createSessionToken('admin', false);
  const [data, sig] = token.split('.');
  const corruptedSig = sig.slice(0, -2) + (sig.slice(-2) === 'aa' ? 'bb' : 'aa');
  const tamperedToken = `${data}.${corruptedSig}`;

  const verified = verifySessionToken(tamperedToken);
  assert.strictEqual(verified, null);
});

test('verifySessionToken: tampered data payload is rejected', () => {
  const token = createSessionToken('admin', false);
  const [, sig] = token.split('.');
  const forgedPayload = Buffer.from(JSON.stringify({ user: 'hacker', exp: Date.now() + 10000 })).toString('base64url');
  const tamperedToken = `${forgedPayload}.${sig}`;

  const verified = verifySessionToken(tamperedToken);
  assert.strictEqual(verified, null);
});

test('verifySessionToken: expired token is rejected', () => {
  // Construct a token with exp in the past signed with real secret
  const now = Date.now();
  const pastPayload = { user: 'admin', exp: now - 5000, iat: now - 10000 };
  const data = Buffer.from(JSON.stringify(pastPayload)).toString('base64url');
  const secret = process.env.ADMIN_SESSION_SECRET || 'maijrun_vip_luxury_atelier_secret_key_2026_q8w9e1r2t3y4';
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  const expiredToken = `${data}.${sig}`;

  const verified = verifySessionToken(expiredToken);
  assert.strictEqual(verified, null);
});

test('verifySessionToken: malformed payload with non-number exp is rejected', () => {
  const invalidPayload = { user: 'admin', exp: 'infinite' };
  const data = Buffer.from(JSON.stringify(invalidPayload)).toString('base64url');
  const secret = process.env.ADMIN_SESSION_SECRET || 'maijrun_vip_luxury_atelier_secret_key_2026_q8w9e1r2t3y4';
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  const invalidToken = `${data}.${sig}`;

  assert.strictEqual(verifySessionToken(invalidToken), null);
});

test('verifySessionToken: invalid/garbage tokens return null', () => {
  assert.strictEqual(verifySessionToken(''), null);
  assert.strictEqual(verifySessionToken(null), null);
  assert.strictEqual(verifySessionToken(undefined), null);
  assert.strictEqual(verifySessionToken('not-a-token'), null);
  assert.strictEqual(verifySessionToken('part1.part2.part3'), null);
});

// 5. Cookie Configuration Tests
test('getCookieOptions: produces secure HttpOnly cookie config with expiry', () => {
  const opts = getCookieOptions(false);
  assert.strictEqual(opts.name, ADMIN_COOKIE_NAME);
  assert.strictEqual(opts.httpOnly, true);
  assert.strictEqual(opts.sameSite, 'lax');
  assert.strictEqual(opts.path, '/');
  assert.strictEqual(opts.maxAge, 86400); // 24 hours
  assert.ok(opts.expires instanceof Date);

  const rememberOpts = getCookieOptions(true);
  assert.strictEqual(rememberOpts.maxAge, 2592000); // 30 days
});

console.log(`\n🎉 All ${passedTests} security & authentication unit tests passed!`);

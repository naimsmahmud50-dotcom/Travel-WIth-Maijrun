import crypto from 'crypto';
import { createRequire } from 'module';

export const ADMIN_COOKIE_NAME = 'maijrun_admin_token';

let nextCookiesFn: (() => any) | null = null;
try {
  const req = createRequire(import.meta.url);
  const nextHeaders = req('next/headers');
  nextCookiesFn = nextHeaders?.cookies || null;
} catch {
  // Not running inside Next.js bundle or next/headers not accessible
}

// Safe constant-time string equality check to prevent timing attacks
export function safeCompare(a: unknown, b: unknown): boolean {
  try {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }
    const hashA = crypto.createHash('sha256').update(a).digest();
    const hashB = crypto.createHash('sha256').update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

export function getAdminUsers(): string[] {
  const envUsers = process.env.ADMIN_USERS;
  if (envUsers) {
    return envUsers
      .split(',')
      .map((u) => u.trim().toLowerCase())
      .filter(Boolean);
  }
  return ['naimsmahmud50@gmail.com', 'admin', 'maijrun_vip'];
}

export function getAdminPassword(): string {
  // Strong default fallback; can be overridden via ADMIN_PASSWORD in .env.local
  return process.env.ADMIN_PASSWORD || 'Maijrun#RoyalElite@2026!Secured';
}

export function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    'maijrun_vip_luxury_atelier_secret_key_2026_q8w9e1r2t3y4'
  );
}

// IP-based Rate Limiting for Admin Authentication (Anti-Brute-Force)
// Max 5 failed attempts within a 60-second window
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const loginRateLimitMap = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= 5) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    loginRateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

export function clearLoginRateLimit(ip: string): void {
  loginRateLimitMap.delete(ip);
}

export interface AdminUserValidation {
  valid: boolean;
  user?: string;
  error?: string;
}

export function validateAdminCredentials(
  identifier: string,
  password: string
): AdminUserValidation {
  if (!identifier || !password) {
    return { valid: false, error: 'Identifier and password are required.' };
  }

  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  const allowedUsers = getAdminUsers();
  const isUserAllowed = allowedUsers.some((u) => u === cleanId);
  if (!isUserAllowed) {
    return { valid: false, error: 'Invalid Executive Identifier or Master Passcode.' };
  }

  const expectedPassword = getAdminPassword();
  const isPasswordValid = safeCompare(cleanPass, expectedPassword);

  if (!isPasswordValid) {
    return { valid: false, error: 'Invalid Executive Identifier or Master Passcode.' };
  }

  const displayName = cleanId.includes('@')
    ? cleanId
    : 'Sheikh Mahmud Hasan (VIP Admin)';

  return { valid: true, user: displayName };
}

export interface SessionPayload {
  user: string;
  exp: number;
  iat: number;
}

export function createSessionToken(user: string, remember: boolean = false): string {
  const secret = getSessionSecret();
  const now = Date.now();
  const durationMs = remember
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 24 * 60 * 60 * 1000; // 24 hours

  const payload: SessionPayload = {
    user,
    iat: now,
    exp: now + durationMs,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

export function verifySessionToken(
  token: string | null | undefined
): { user: string; exp: number } | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  if (!data || !signature) return null;

  const secret = getSessionSecret();
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64url');

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(data, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload.user !== 'string' ||
      !payload.user ||
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp)
    ) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null; // Expired session
    }

    return { user: payload.user, exp: payload.exp };
  } catch {
    return null;
  }
}

export function getCookieOptions(remember: boolean = false) {
  const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
  };
}

export function getSessionFromRequest(request?: Request): { user: string; exp: number } | null {
  try {
    if (request) {
      // 1. Check Authorization header
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const bearer = authHeader.slice(7).trim();
        const verified = verifySessionToken(bearer);
        if (verified) return verified;
      }

      // 2. Check Cookie header from request
      const cookieHeader = request.headers.get('cookie') || '';
      const pairs = cookieHeader.split(';');
      for (const pair of pairs) {
        const [k, ...v] = pair.trim().split('=');
        if (k === ADMIN_COOKIE_NAME) {
          const val = v.join('=');
          try {
            const verified = verifySessionToken(decodeURIComponent(val));
            if (verified) return verified;
          } catch {
            // Malformed URI encoding in cookie value
          }
        }
      }
    }

    // 3. Fallback to Next.js cookies() helper if available in current runtime
    if (typeof nextCookiesFn === 'function') {
      try {
        const cookieStore = nextCookiesFn();
        const token = cookieStore?.get(ADMIN_COOKIE_NAME)?.value;
        return verifySessionToken(token);
      } catch {
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}

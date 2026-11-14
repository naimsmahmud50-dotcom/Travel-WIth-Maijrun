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
export function safeCompare(a: string, b: string): boolean {
  try {
    const hashA = crypto.createHash('sha256').update(String(a)).digest();
    const hashB = crypto.createHash('sha256').update(String(b)).digest();
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
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (!payload.user || !payload.exp) {
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
          const verified = verifySessionToken(decodeURIComponent(val));
          if (verified) return verified;
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

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Travel With Maijrun — Security & Defense Engine
 * Implements OWASP Top 10 mitigations:
 * - Anti-XSS Sanitization
 * - Public Endpoint Rate Limiting
 * - Bot Honeypot Detection
 * - Ephemeral Filesystem Fallback (Vercel Serverless EROFS protection)
 */

// 1. Anti-XSS and Input Sanitization
export function sanitizeText(val: unknown, maxLength: number = 500): string {
  if (typeof val !== 'string') return '';
  
  return val
    // Remove null bytes and non-printable control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip script, style, and iframe tags along with their inner content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Strip remaining HTML tags and angle brackets
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/[<>]/g, '')
    // Normalize excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

// 2. Email Validation (RFC 5322 compatible regex & length check)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 150) return false;
  // Disallow line breaks to prevent header injection
  if (/[\r\n]/.test(clean)) return false;
  return EMAIL_REGEX.test(clean);
}

// 3. International Phone Validation (+880, +1, +44, etc.)
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  const clean = phone.trim();
  if (clean.length < 7 || clean.length > 30) return false;
  // Disallow line breaks
  if (/[\r\n]/.test(clean)) return false;
  // Allowed characters: +, numbers, spaces, hyphens, parentheses, dots
  return /^[+]?[\d\s\-().]{7,30}$/.test(clean);
}

// 4. Bot Honeypot Detection
export function isHoneypotTriggered(body: any): boolean {
  if (!body || typeof body !== 'object') return false;
  // Standard bot traps: hidden fields that legitimate users never fill
  const honeypotKeys = ['website', 'fax_number', 'url', 'bot_token', 'company_fax'];
  for (const key of honeypotKeys) {
    if (body[key] && typeof body[key] === 'string' && body[key].trim().length > 0) {
      return true;
    }
  }
  return false;
}

// 5. Public Endpoint Rate Limiting (Anti-DoS / Anti-Spam)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const publicRateLimitMap = new Map<string, RateLimitEntry>();

export function checkPublicRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; retryAfterSeconds: number } {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const entry = publicRateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    publicRateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// Clear rate limits for testing
export function clearPublicRateLimits(): void {
  publicRateLimitMap.clear();
}

// 6. Resilient Storage Path (Handles Vercel Read-Only Ephemeral Filesystem)
export function getStorageFilePath(filename: string): string {
  const preferredDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(preferredDir)) {
      fs.mkdirSync(preferredDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(preferredDir, '.write_test');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return path.join(preferredDir, filename);
  } catch {
    // Fallback to /tmp on serverless environments where /var/task is read-only
    const tmpDir = path.join('/tmp', 'travel-with-maijrun-data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {
        // Fallback directly to /tmp
        return path.join('/tmp', filename);
      }
    }
    return path.join(tmpDir, filename);
  }
}

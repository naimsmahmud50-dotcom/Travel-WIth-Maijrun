/**
 * Travel With Maijrun — Standalone Full-Stack Node.js Server
 * Zero-dependency native HTTP server serving both the Frontend UI and Backend REST APIs.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables from .env.local if present
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf-8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

const ADMIN_COOKIE_NAME = 'maijrun_admin_token';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Maijrun#RoyalElite@2026!Secured';
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'maijrun_vip_luxury_atelier_secret_key_2026_q8w9e1r2t3y4';
const ADMIN_USERS = (process.env.ADMIN_USERS || 'naimsmahmud50@gmail.com,admin,maijrun_vip')
  .split(',')
  .map((u) => u.trim().toLowerCase());

// Helper for constant-time comparison
function safeCompare(a, b) {
  try {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const hashA = crypto.createHash('sha256').update(String(a)).digest();
    const hashB = crypto.createHash('sha256').update(String(b)).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

// IP-based Rate Limiting for Admin Authentication
const loginRateLimitMap = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || '127.0.0.1';
}

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) return { allowed: true, retryAfterSeconds: 0 };
  if (entry.count >= 5) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

function recordFailedLogin(ip) {
  const now = Date.now();
  const entry = loginRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    loginRateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
  } else {
    entry.count += 1;
  }
}

function clearLoginRateLimit(ip) {
  loginRateLimitMap.delete(ip);
}

// Session Helpers
function createSessionToken(user, remember) {
  const now = Date.now();
  const durationMs = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const payload = { user, iat: now, exp: now + durationMs };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(data).digest('base64url');
  if (!safeCompare(signature, expectedSig)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload.user !== 'string' ||
      !payload.user ||
      typeof payload.exp !== 'number' ||
      !Number.isFinite(payload.exp) ||
      Date.now() > payload.exp
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function getSessionFromReq(req) {
  // Check auth header
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7).trim();
    const valid = verifySessionToken(token);
    if (valid) return valid;
  }

  // Check cookie
  const cookieHeader = req.headers['cookie'] || '';
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [k, ...v] = pair.trim().split('=');
    if (k === ADMIN_COOKIE_NAME) {
      try {
        const val = decodeURIComponent(v.join('='));
        const valid = verifySessionToken(val);
        if (valid) return valid;
      } catch {
        // Malformed URI encoding
      }
    }
  }
  return null;
}

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
}

// Sample Destinations DB
const DESTINATIONS = [
  {
    id: 'makkah',
    category: 'pilgrimage',
    tag: 'Royal Presidential',
    duration: '10 Days • 9 Nights',
    country: 'Saudi Arabia',
    region: 'Bespoke Umrah',
    title: 'The Sacred Sanctuaries: Makkah & Madinah',
    desc: 'Direct Kaaba-view suites at Raffles or Dar Al Tawhid, Haram VIP access assistance, private luxury bullet train transfers, and scholars on retinue.',
    priceBdt: 695000,
    priceUsd: 5800,
    halalFeatures: ['Kaaba-view private suites', 'Haram VIP escort', 'Dedicated Islamic scholar'],
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=85&w=900&auto=format&fit=crop',
  },
  {
    id: 'spain',
    category: 'heritage',
    tag: 'Cultural Heritage',
    duration: '12 Days • 11 Nights',
    country: 'Spain',
    region: 'Granada, Cordoba, Seville',
    title: 'Echoes of Al-Andalus: Moorish Splendors',
    desc: 'Private after-hours entry into the Alhambra and Great Mosque of Cordoba. Halal Andalusian culinary tastings and luxury historical estates.',
    priceBdt: 768000,
    priceUsd: 6400,
    halalFeatures: ['Private Michelin-star halal chef', 'After-hours Alhambra access'],
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=85&w=900&auto=format&fit=crop',
  },
  {
    id: 'maldives',
    category: 'island',
    tag: '100% Privacy',
    duration: '7 Days • 6 Nights',
    country: 'Maldives',
    region: 'Bespoke Island Escape',
    title: 'The Pearl Pavilions: Private Overwater Sanctuary',
    desc: 'Enclosed lagoon infinity pool, halal private destination dining under the stars, zero public visibility, and dedicated private seaplane transfers.',
    priceBdt: 864000,
    priceUsd: 7200,
    halalFeatures: ['Zero-sightline enclosed pool', 'Alcohol-free villa'],
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=85&w=900&auto=format&fit=crop',
  },
];

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. GET /api/destinations
  if (req.method === 'GET' && url.pathname === '/api/destinations') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: DESTINATIONS }));
    return;
  }

  // 2. POST /api/admin/login
  if (req.method === 'POST' && url.pathname === '/api/admin/login') {
    const clientIp = getClientIp(req);
    const rateCheck = checkLoginRateLimit(clientIp);

    if (!rateCheck.allowed) {
      res.writeHead(429, {
        'Content-Type': 'application/json',
        'Retry-After': String(rateCheck.retryAfterSeconds),
      });
      res.end(
        JSON.stringify({
          success: false,
          error: `Too many failed login attempts. Atelier access temporarily locked. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        })
      );
      return;
    }

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { identifier, password, remember } = JSON.parse(body);
        const cleanId = (identifier || '').trim().toLowerCase();
        const cleanPass = (password || '').trim();

        if (!cleanId || !cleanPass) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Identifier and password are required.' }));
          return;
        }

        const isUserAllowed = ADMIN_USERS.includes(cleanId);
        const isPassValid = safeCompare(cleanPass, ADMIN_PASSWORD);

        if (!isUserAllowed || !isPassValid) {
          recordFailedLogin(clientIp);
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Authentication rejected. Invalid Executive Identifier or Master Passcode.' }));
          return;
        }

        clearLoginRateLimit(clientIp);

        const displayName = cleanId.includes('@') ? cleanId : 'Sheikh Mahmud Hasan (VIP Admin)';
        const token = createSessionToken(displayName, Boolean(remember));
        const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;
        const expires = new Date(Date.now() + maxAge * 1000).toUTCString();

        res.setHeader('Set-Cookie', `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, user: displayName, message: 'VIP Atelier clearance granted.' }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 3. GET /api/admin/session
  if (req.method === 'GET' && url.pathname === '/api/admin/session') {
    const session = getSessionFromReq(req);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (session) {
      res.end(JSON.stringify({ authenticated: true, user: session.user, expiresAt: session.exp }));
    } else {
      res.end(JSON.stringify({ authenticated: false }));
    }
    return;
  }

  // 4. POST /api/admin/logout
  if (req.method === 'POST' && url.pathname === '/api/admin/logout') {
    res.setHeader('Set-Cookie', `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Signed out successfully.' }));
    return;
  }

  // 5. GET & POST /api/inquiries
  if (url.pathname === '/api/inquiries') {
    if (req.method === 'GET') {
      const session = getSessionFromReq(req);
      if (!session) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin authentication clearance required.' }));
        return;
      }

      const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: JSON.parse(data) }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!parsed.name || !parsed.email || !parsed.phone) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Name, email, and phone are required fields.' }));
            return;
          }

          const data = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
          const newInquiry = {
            id: `INQ-${Date.now()}`,
            name: parsed.name,
            email: parsed.email,
            phone: parsed.phone,
            destination: parsed.destination || 'Custom Bespoke',
            guests: parsed.guests || '2 Guests',
            preferences: parsed.preferences || '',
            status: 'NEW',
            createdAt: new Date().toISOString(),
          };
          data.unshift(newInquiry);
          fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(data, null, 2));

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Inquiry saved successfully', inquiryId: newInquiry.id }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // 6. POST /api/newsletter
  if (req.method === 'POST' && url.pathname === '/api/newsletter') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);
        if (!email || !email.includes('@')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid email address' }));
          return;
        }
        const data = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
        if (!data.some((s) => s.email === email)) {
          data.push({ email, subscribedAt: new Date().toISOString() });
          fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Subscribed successfully' }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 7. Static File Server (Serving ONLY authorized public landing pages)
  const pathname = url.pathname;
  if (pathname === '/' || pathname === '/index.html') {
    const filePath = path.join(__dirname, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  if (pathname === '/admin' || pathname === '/admin.html') {
    const filePath = path.join(__dirname, 'admin.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Strictly block any other files (protects .env.local, inquiries.json, source code, node_modules)
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`\n=========================================================`);
  console.log(`✨ Travel With Maijrun — Full-Stack Server Running!`);
  console.log(`📍 Web Platform: http://localhost:${PORT}`);
  console.log(`📍 Inquiries API: http://localhost:${PORT}/api/inquiries`);
  console.log(`📍 Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`=========================================================\n`);
});

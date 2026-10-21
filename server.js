/**
 * Travel With Maijrun — Standalone Full-Stack Node.js Server
 * Zero-dependency native HTTP server serving both the Frontend UI and Backend REST APIs.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  // 2. GET & POST /api/inquiries
  if (url.pathname === '/api/inquiries') {
    if (req.method === 'GET') {
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
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // 3. POST /api/newsletter
  if (req.method === 'POST' && url.pathname === '/api/newsletter') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { email } = JSON.parse(body);
        const data = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
        if (!data.some((s) => s.email === email)) {
          data.push({ email, subscribedAt: new Date().toISOString() });
          fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Subscribed successfully' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid email' }));
      }
    });
    return;
  }

  // 4. Static File Server (Serving index.html and admin.html)
  let requestedPath = url.pathname;
  if (requestedPath === '/admin' || requestedPath === '/admin/') {
    requestedPath = 'admin.html';
  } else if (requestedPath === '/') {
    requestedPath = 'index.html';
  }
  let filePath = path.join(__dirname, requestedPath);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
  };

  const contentType = mimeTypes[ext] || 'text/html';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n=========================================================`);
  console.log(`✨ Travel With Maijrun — Full-Stack Server Running!`);
  console.log(`📍 Web Platform: http://localhost:${PORT}`);
  console.log(`📍 Inquiries API: http://localhost:${PORT}/api/inquiries`);
  console.log(`📍 Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`=========================================================\n`);
});

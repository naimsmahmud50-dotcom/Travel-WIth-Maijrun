import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getSessionFromRequest } from '@/lib/auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
  }
}

function readInquiries(): any[] {
  ensureDataFile();
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const inquiries = data ? JSON.parse(data) : [];
    return Array.isArray(inquiries) ? inquiries : [];
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

const NO_CACHE_SECURITY_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Admin authentication clearance required to access client dossiers.',
        },
        {
          status: 401,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }

    const inquiries = readInquiries();
    return NextResponse.json(
      { success: true, count: inquiries.length, data: inquiries },
      {
        status: 200,
        headers: NO_CACHE_SECURITY_HEADERS,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inquiries' },
      {
        status: 500,
        headers: NO_CACHE_SECURITY_HEADERS,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload in request body.' },
        {
          status: 400,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }
    const { name, email, phone, destination, guests, preferences } = body || {};

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone/WhatsApp are required fields.' },
        {
          status: 400,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }

    const inquiries = readInquiries();
    const entropy = crypto.randomBytes(4).toString('hex');
    const newInquiry = {
      id: `INQ-${Date.now()}-${entropy}`,
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      destination: (typeof destination === 'string' && destination.trim()) || 'Custom Bespoke',
      guests: (typeof guests === 'string' && guests.trim()) || 'Couples / 2 Guests',
      preferences: (typeof preferences === 'string' && preferences.trim()) || 'None specified',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));

    return NextResponse.json(
      {
        success: true,
        message: 'Bespoke inquiry received successfully. Our VIP director will contact you.',
        inquiryId: newInquiry.id,
      },
      {
        status: 200,
        headers: NO_CACHE_SECURITY_HEADERS,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      {
        status: 500,
        headers: NO_CACHE_SECURITY_HEADERS,
      }
    );
  }
}

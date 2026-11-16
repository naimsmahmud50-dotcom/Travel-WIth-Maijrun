import { NextResponse } from 'next/server';
import fs from 'fs';
import crypto from 'crypto';
import { getSessionFromRequest, getClientIp } from '@/lib/auth';
import {
  sanitizeText,
  isValidEmail,
  isValidPhone,
  isHoneypotTriggered,
  checkPublicRateLimit,
  getStorageFilePath,
} from '@/lib/security';

function getInquiriesFilePath(): string {
  return getStorageFilePath('inquiries.json');
}

function ensureDataFile(): string {
  const filePath = getInquiriesFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('Warning: Unable to ensure inquiries file on filesystem:', err);
  }
  return filePath;
}

function readInquiries(): any[] {
  const filePath = ensureDataFile();
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const inquiries = data ? JSON.parse(data) : [];
      return Array.isArray(inquiries) ? inquiries : [];
    }
    return [];
  } catch {
    return [];
  }
}

function writeInquiries(inquiries: any[]): boolean {
  const filePath = ensureDataFile();
  try {
    fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2));
    return true;
  } catch (err) {
    console.error('Warning: Failed to persist inquiries to disk:', err);
    return false;
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
    const clientIp = getClientIp(request);

    // 1. Rate Limiting Protection (Anti-DoS / Anti-Spam)
    const rateCheck = checkPublicRateLimit(clientIp, 'inquiries', 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`,
        },
        {
          status: 429,
          headers: {
            ...NO_CACHE_SECURITY_HEADERS,
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

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

    // 2. Invisible Bot Honeypot Check
    if (isHoneypotTriggered(body)) {
      // Return synthetic success to confuse spam bots without saving junk
      return NextResponse.json(
        {
          success: true,
          message: 'Bespoke inquiry received successfully. Our VIP director will contact you.',
          inquiryId: `INQ-${Date.now()}-trap`,
        },
        {
          status: 200,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }

    const rawName = body?.name || body?.fullName;
    const rawEmail = body?.email;
    const rawPhone = body?.phone || body?.whatsapp;
    const rawDestination = body?.destination || body?.destinationTitle;
    const rawGuests = body?.guests || body?.guestCount || body?.guestsCount;
    const rawPreferences = body?.preferences || body?.specialRequests;
    const rawDates = body?.preferredDates || body?.dates;

    // 3. Strict Validation & XSS Sanitization
    const sanitizedName = sanitizeText(rawName, 100);
    const sanitizedEmail = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const sanitizedPhone = typeof rawPhone === 'string' ? rawPhone.trim() : '';

    if (!sanitizedName || !sanitizedEmail || !sanitizedPhone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone/WhatsApp are required fields.' },
        {
          status: 400,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        {
          status: 400,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }

    if (!isValidPhone(sanitizedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid contact telephone/WhatsApp number.' },
        {
          status: 400,
          headers: NO_CACHE_SECURITY_HEADERS,
        }
      );
    }

    const sanitizedDestination = sanitizeText(rawDestination, 100) || 'Custom Bespoke';
    const sanitizedGuests = sanitizeText(rawGuests, 50) || 'Couples / 2 Guests';
    const sanitizedPreferences = sanitizeText(rawPreferences, 2000) || 'None specified';
    const sanitizedDates = sanitizeText(rawDates, 100) || 'Flexible';

    // 4. Persistence
    const inquiries = readInquiries();
    const entropy = crypto.randomBytes(4).toString('hex');
    const newInquiry = {
      id: `INQ-${Date.now()}-${entropy}`,
      name: sanitizedName,
      fullName: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      destination: sanitizedDestination,
      destinationTitle: sanitizedDestination,
      guests: sanitizedGuests,
      guestCount: sanitizedGuests,
      preferences: sanitizedPreferences,
      specialRequests: sanitizedPreferences,
      preferredDates: sanitizedDates,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    writeInquiries(inquiries);

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

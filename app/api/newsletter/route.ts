import { NextResponse } from 'next/server';
import fs from 'fs';
import { getClientIp } from '@/lib/auth';
import {
  isValidEmail,
  isHoneypotTriggered,
  checkPublicRateLimit,
  getStorageFilePath,
} from '@/lib/security';

function getSubscribersFilePath(): string {
  return getStorageFilePath('subscribers.json');
}

function ensureDataFile(): string {
  const filePath = getSubscribersFilePath();
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('Warning: Unable to ensure subscribers file:', err);
  }
  return filePath;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // 1. Rate Limiting Protection
    const rateCheck = checkPublicRateLimit(clientIp, 'newsletter', 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many subscription attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }

    // 2. Invisible Bot Honeypot Check
    if (isHoneypotTriggered(body)) {
      return NextResponse.json({
        success: true,
        message: 'Subscribed to the Travel With Maijrun Private Society newsletter.',
      });
    }

    const { email } = body || {};

    // 3. Strict RFC-Compliant Email Validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const filePath = ensureDataFile();
    let subscribers: any[] = [];

    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        subscribers = data ? JSON.parse(data) : [];
        if (!Array.isArray(subscribers)) subscribers = [];
      }
    } catch {
      subscribers = [];
    }

    if (!subscribers.some((s: any) => s.email === cleanEmail)) {
      subscribers.push({ email: cleanEmail, subscribedAt: new Date().toISOString() });
      try {
        fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2));
      } catch (err) {
        console.error('Warning: Failed to persist subscriber to disk:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed to the Travel With Maijrun Private Society newsletter.',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

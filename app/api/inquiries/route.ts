import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function GET() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const inquiries = JSON.parse(data);
    return NextResponse.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, destination, guests, preferences } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and phone/WhatsApp are required fields.' },
        { status: 400 }
      );
    }

    ensureDataFile();
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const inquiries = JSON.parse(data);

    const newInquiry = {
      id: `INQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      phone,
      destination: destination || 'Custom Itinerary',
      guests: guests || 'Couples / 2 Guests',
      preferences: preferences || 'None specified',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Bespoke inquiry received successfully. Our VIP director will contact you.',
      inquiryId: newInquiry.id,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import { getSessionFromRequest } from '@/lib/auth';
import { getStorageFilePath } from '@/lib/security';

function getInquiriesFilePath(): string {
  return getStorageFilePath('inquiries.json');
}

function readInquiries(): any[] {
  const filePath = getInquiriesFilePath();
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
  const filePath = getInquiriesFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2));
    return true;
  } catch (err) {
    console.error('Warning: Failed to persist inquiries to disk:', err);
    return false;
  }
}

const NO_CACHE_SECURITY_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
};

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication clearance required.' },
        { status: 401, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required.' },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const { id, status } = body;
    const validStatuses = ['NEW', 'CONTACTED', 'CONFIRMED', 'ARCHIVED'];
    const normalizedStatus = typeof status === 'string' ? status.toUpperCase().trim() : '';

    if (!validStatuses.includes(normalizedStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const inquiries = readInquiries();
    const index = inquiries.findIndex((inq: any) => inq.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found.' },
        { status: 404, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    inquiries[index].status = normalizedStatus;
    inquiries[index].updatedAt = new Date().toISOString();
    writeInquiries(inquiries);

    return NextResponse.json(
      { success: true, message: 'Inquiry status updated successfully.', inquiry: inquiries[index] },
      { status: 200, headers: NO_CACHE_SECURITY_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update inquiry.' },
      { status: 500, headers: NO_CACHE_SECURITY_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication clearance required.' },
        { status: 401, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const url = new URL(request.url);
    let id = url.searchParams.get('id');
    if (!id) {
      const body = await request.json().catch(() => null);
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required for deletion.' },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const inquiries = readInquiries();
    const index = inquiries.findIndex((inq: any) => inq.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Inquiry not found.' },
        { status: 404, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const deleted = inquiries.splice(index, 1)[0];
    writeInquiries(inquiries);

    return NextResponse.json(
      { success: true, message: 'Inquiry deleted successfully.', id: deleted.id },
      { status: 200, headers: NO_CACHE_SECURITY_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete inquiry.' },
      { status: 500, headers: NO_CACHE_SECURITY_HEADERS }
    );
  }
}

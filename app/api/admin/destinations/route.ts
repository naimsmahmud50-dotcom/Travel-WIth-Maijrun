import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import {
  readDestinationsFromStore,
  createDestinationInStore,
  updateDestinationInStore,
  deleteDestinationFromStore,
} from '@/lib/destinations-store';

const NO_CACHE_SECURITY_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
};

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const destinations = readDestinationsFromStore();
    return NextResponse.json(
      { success: true, count: destinations.length, data: destinations },
      { status: 200, headers: NO_CACHE_SECURITY_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch destinations' },
      { status: 500, headers: NO_CACHE_SECURITY_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication clearance required.' },
        { status: 401, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload.' },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const result = createDestinationInStore(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create destination.' },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'New destination created successfully.', data: result.item },
      { status: 201, headers: NO_CACHE_SECURITY_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error while creating destination.' },
      { status: 500, headers: NO_CACHE_SECURITY_HEADERS }
    );
  }
}

export async function PUT(request: Request) {
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
        { success: false, error: 'Destination ID is required for updating.' },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const result = updateDestinationInStore(body.id, body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Destination not found.' },
        { status: 404, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Destination updated successfully.', data: result.item },
      { status: 200, headers: NO_CACHE_SECURITY_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error while updating destination.' },
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
        { success: false, error: 'Destination ID is required for deletion.' },
        { status: 400, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    const result = deleteDestinationFromStore(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Destination not found.' },
        { status: 404, headers: NO_CACHE_SECURITY_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Destination deleted successfully.', id: result.id },
      { status: 200, headers: NO_CACHE_SECURITY_HEADERS }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error while deleting destination.' },
      { status: 500, headers: NO_CACHE_SECURITY_HEADERS }
    );
  }
}

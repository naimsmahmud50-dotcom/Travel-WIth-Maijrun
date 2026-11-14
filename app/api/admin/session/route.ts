import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: session.user,
      expiresAt: session.exp,
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}

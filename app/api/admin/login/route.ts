import { NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createSessionToken,
  getCookieOptions,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { identifier, password, remember } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Both Executive Identifier and Master Passcode are required.',
        },
        { status: 400 }
      );
    }

    const result = validateAdminCredentials(identifier, password);
    if (!result.valid || !result.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication rejected. Invalid Executive Identifier or Master Passcode.',
        },
        { status: 401 }
      );
    }

    const token = createSessionToken(result.user, Boolean(remember));
    const cookieOpts = getCookieOptions(Boolean(remember));

    const response = NextResponse.json({
      success: true,
      message: 'VIP Atelier clearance granted.',
      user: result.user,
    });

    response.cookies.set({
      name: cookieOpts.name,
      value: token,
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server authentication error.' },
      { status: 500 }
    );
  }
}

/**
 * Next.js Middleware - Authentication Guard
 *
 * @description Protects all routes except /login and /api/auth/login
 * Checks for valid authentication cookie and redirects to login if not found
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Get JWT secret for token verification
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not set');
    return new TextEncoder().encode('fallback-secret-for-development-only');
  }

  return new TextEncoder().encode(secret);
}

/**
 * Verify authentication token
 */
async function verifyAuth(token: string): Promise<boolean> {
  try {
    const secret = getJWTSecret();
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Middleware function - runs on every request
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = [
    '/login',
    '/api/auth/login',
    '/api/auth/logout',
  ];

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check authentication
  const authToken = request.cookies.get('auth-token');

  if (!authToken) {
    // Not authenticated - redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token is valid
  const isValid = await verifyAuth(authToken.value);

  if (!isValid) {
    // Invalid token - redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    const response = NextResponse.redirect(loginUrl);

    // Clear invalid cookie
    response.cookies.delete('auth-token');

    return response;
  }

  // Authenticated - allow access
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};

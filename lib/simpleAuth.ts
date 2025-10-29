/**
 * Simple Password Authentication for note Membership
 *
 * @description Cookie-based authentication with 30-day expiration
 * No database required - password is stored in environment variables
 *
 * SECURITY: JWT_SECRET and MEMBERSHIP_PASSWORD MUST be set in environment variables
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

/**
 * Validate and load JWT secret from environment
 *
 * @throws {Error} If JWT_SECRET is not configured
 * @returns TextEncoder instance with the secret
 *
 * @example
 * Generate a strong secret:
 * ```bash
 * # Generate a 32-byte random secret (256 bits)
 * openssl rand -base64 32
 * # or
 * node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 * ```
 *
 * Then add to .env.local:
 * ```
 * JWT_SECRET=your-generated-secret-here
 * ```
 */
function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      'SECURITY ERROR: JWT_SECRET environment variable is not set. ' +
      'Generate a strong secret with: openssl rand -base64 32'
    );
  }

  if (secret.length < 32) {
    throw new Error(
      'SECURITY ERROR: JWT_SECRET is too short. ' +
      'Must be at least 32 characters. Generate a strong secret with: openssl rand -base64 32'
    );
  }

  return new TextEncoder().encode(secret);
}

/**
 * Get JWT secret (cached after first call)
 */
const JWT_SECRET = getJWTSecret();

/**
 * Validate and load membership password from environment
 *
 * @throws {Error} If MEMBERSHIP_PASSWORD is not configured
 * @returns The membership password
 */
function getMembershipPassword(): string {
  const password = process.env.MEMBERSHIP_PASSWORD;

  if (!password) {
    throw new Error(
      'SECURITY ERROR: MEMBERSHIP_PASSWORD environment variable is not set. ' +
      'Please configure it in .env.local'
    );
  }

  if (password.length < 8) {
    throw new Error(
      'SECURITY ERROR: MEMBERSHIP_PASSWORD is too short. ' +
      'Must be at least 8 characters for security.'
    );
  }

  return password;
}

/**
 * Get membership password (cached after first call)
 */
const MEMBERSHIP_PASSWORD = getMembershipPassword();

export interface AuthSession {
  authenticated: boolean;
  loginDate: string;
}

/**
 * Verify password
 *
 * @param password - Password from user input
 * @returns true if password matches
 */
export function verifyPassword(password: string): boolean {
  return password === MEMBERSHIP_PASSWORD;
}

/**
 * Create authentication token (30 days validity)
 *
 * @returns JWT token string
 */
export async function createAuthToken(): Promise<string> {
  const token = await new SignJWT({
    authenticated: true,
    loginDate: new Date().toISOString(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 30日間有効
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify authentication token
 *
 * @param token - JWT token string
 * @returns Session data or null if invalid/expired
 */
export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSession;
  } catch (error) {
    // Token expired or invalid
    return null;
  }
}

/**
 * Check if user is authenticated (from cookie)
 *
 * @returns Session data or null if not authenticated
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return await verifyAuthToken(token);
}

/**
 * Set authentication cookie (30 days)
 *
 * @param token - JWT token to store
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30日間
    path: '/',
  });
}

/**
 * Clear authentication cookie (logout)
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

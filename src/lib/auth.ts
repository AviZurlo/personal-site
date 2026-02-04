import { SignJWT, jwtVerify } from 'jose';
import type { AstroCookies } from 'astro';

const SESSION_SECRET = new TextEncoder().encode(
  import.meta.env.SESSION_SECRET || 'default-dev-secret-change-in-production'
);
const SESSION_COOKIE_NAME = 'editor_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  userId: string;
  exp: number;
}

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SESSION_SECRET);

  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(token, SESSION_SECRET);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(cookies: AstroCookies): Promise<SessionPayload | null> {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifySession(token);
}

export function setSessionCookie(cookies: AstroCookies, token: string) {
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export function deleteSessionCookie(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: '/',
  });
}

export function validateCredentials(username: string, password: string): boolean {
  const validUsername = import.meta.env.EDITOR_USERNAME || 'admin';
  const validPassword = import.meta.env.EDITOR_PASSWORD || 'password';

  return username === validUsername && password === validPassword;
}

export async function requireAuth(cookies: AstroCookies): Promise<SessionPayload> {
  const session = await getSession(cookies);
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

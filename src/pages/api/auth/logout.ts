import type { APIRoute } from 'astro';
import { deleteSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  // Only allow in development
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteSessionCookie(cookies);

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

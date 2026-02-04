import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  // Only allow in development
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const session = await getSession(cookies);

  return new Response(
    JSON.stringify({ authenticated: !!session }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

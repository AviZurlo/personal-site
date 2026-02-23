import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  }

  const session = await getSession(cookies);

  return new Response(
    JSON.stringify({ authenticated: !!session }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

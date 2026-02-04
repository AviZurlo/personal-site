import type { APIRoute } from 'astro';
import { getPage, updatePage } from '../../../lib/content-manager';
import { requireAuth } from '../../../lib/auth';

export const GET: APIRoute = async () => {
  // Only allow in development
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const page = await getPage('about');

    if (!page) {
      return new Response(
        JSON.stringify({ error: 'Page not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(page),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get page' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  // Only allow in development
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check authentication
  try {
    await requireAuth(cookies);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const updates = await request.json();
    const success = await updatePage('about', updates);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Failed to update page' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update page' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

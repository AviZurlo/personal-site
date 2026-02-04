import type { APIRoute } from 'astro';
import { listArticles } from '../../../../lib/content-manager';

export const GET: APIRoute = async () => {
  // Only allow in development
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const articles = await listArticles();

    return new Response(
      JSON.stringify({ articles }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to list articles' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

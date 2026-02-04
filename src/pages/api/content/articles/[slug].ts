import type { APIRoute } from 'astro';
import { getArticle, updateArticle } from '../../../../lib/content-manager';
import { requireAuth } from '../../../../lib/auth';

export async function getStaticPaths() {
  // Don't generate any static pages for admin API routes
  return [];
}

export const GET: APIRoute = async ({ params }) => {
  // Only allow in development
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { slug } = params;

  if (!slug) {
    return new Response(
      JSON.stringify({ error: 'Slug is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const article = await getArticle(slug);

    if (!article) {
      return new Response(
        JSON.stringify({ error: 'Article not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(article),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to get article' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
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

  const { slug } = params;

  if (!slug) {
    return new Response(
      JSON.stringify({ error: 'Slug is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const updates = await request.json();
    const success = await updateArticle(slug, updates);

    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Failed to update article' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update article' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

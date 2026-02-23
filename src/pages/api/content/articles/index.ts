import type { APIRoute } from 'astro';
import { listArticles, createArticle } from '../../../../lib/content-manager';
import { requireAuth } from '../../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
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

export const POST: APIRoute = async ({ request, cookies }) => {
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
    const data = await request.json();

    // Validate required fields
    if (!data.title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create article with default values
    const slug = await createArticle({
      content: data.content || '',
      frontmatter: {
        title: data.title,
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description || '',
        tags: data.tags || [],
        source: data.source || 'original',
        featured: data.featured || false,
      },
    });

    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Article with this title already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ slug }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating article:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create article' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

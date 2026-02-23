import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { put } from '@vercel/blob';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check authentication
    await requireAuth(cookies);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file || !slug) {
      return new Response(
        JSON.stringify({ error: 'File and slug are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename with slug prefix
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const filename = `articles/${slug}/${timestamp}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return new Response(
      JSON.stringify({ url: blob.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload image' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

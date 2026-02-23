import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);

  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri = `${url.origin}/api/auth/github/callback`;

  // Redirect to GitHub OAuth
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo,user');

  return redirect(authUrl.toString());
};

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  const clientId = import.meta.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.OAUTH_GITHUB_CLIENT_SECRET;
  const redirectUri = `${url.origin}/api/auth/github/callback`;

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    // Send token back to Decap CMS
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authorizing...</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        console.log("receiveMessage %o", e);
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({
            token: tokenData.access_token,
            provider: "github"
          })}',
          e.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      console.log("Sending message: %o", "authorizing:github");
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
};

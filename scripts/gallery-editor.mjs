import { readFile, rename, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// The static public site has no editing endpoint. This middleware exists only
// in the local development server and accepts same-origin loopback requests.
export function galleryEditor() {
  const settingsPath = fileURLToPath(new URL('../src/data/photo-gallery.json', import.meta.url));
  const manifestPath = fileURLToPath(new URL('../src/generated/photo-gallery.json', import.meta.url));
  let changeQueue = Promise.resolve();
  const send = (response, status, data) => {
    response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(data));
  };

  return {
    name: 'local-photo-gallery-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (request.url?.split('?')[0] !== '/__gallery/edit') return next();
        const address = request.socket.remoteAddress;
        const loopback = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address);
        const host = request.headers.host || '';
        if (!loopback || !/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host) || request.headers.origin !== `http://${host}`) {
          return send(response, 403, { error: 'Gallery editing is available only in the local preview.' });
        }
        if (request.method !== 'POST' || !request.headers['content-type']?.startsWith('application/json')) {
          return send(response, 405, { error: 'Use a JSON POST request.' });
        }
        try {
          let body = '';
          for await (const chunk of request) {
            body += chunk;
            if (body.length > 4096) return send(response, 413, { error: 'Request is too large.' });
          }
          const { id, action } = JSON.parse(body);
          if (typeof id !== 'string' || !['remove', 'restore'].includes(action)) {
            return send(response, 400, { error: 'Invalid gallery change.' });
          }
          const photos = JSON.parse(await readFile(manifestPath, 'utf8'));
          const photo = photos.find((entry) => entry.id === id);
          if (!photo) return send(response, 404, { error: 'Photo not found. Refresh the page and try again.' });

          changeQueue = changeQueue.catch(() => {}).then(async () => {
            const settings = JSON.parse(await readFile(settingsPath, 'utf8'));
            const hidden = new Set(settings.hidden || []);
            action === 'remove' ? hidden.add(photo.file) : hidden.delete(photo.file);
            settings.hidden = [...hidden].sort();
            await writeFile(`${settingsPath}.tmp`, `${JSON.stringify(settings, null, 2)}\n`);
            await rename(`${settingsPath}.tmp`, settingsPath);
            return photos.filter((entry) => hidden.has(entry.file)).map((entry) => entry.id);
          });
          const hidden = await changeQueue;
          send(response, 200, { id, action, hidden });
        } catch (error) {
          console.error('Could not save photo gallery:', error);
          send(response, 500, { error: 'Could not save the gallery. Please try again.' });
        }
      });
    },
  };
}

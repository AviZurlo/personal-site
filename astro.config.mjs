// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import rehypeExternalLinks from 'rehype-external-links';
import { galleryEditor } from './scripts/gallery-editor.mjs';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  vite: { plugins: [galleryEditor()] },
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ]
  }
});

// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import rehypeExternalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ]
  }
});
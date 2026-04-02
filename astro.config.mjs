import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://automagic.dev',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), tailwind(), sitemap()],
});

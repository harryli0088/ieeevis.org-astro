// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { getBasePath } from './getBasePath.mjs';

// https://astro.build/config
export default defineConfig({
  base: getBasePath(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
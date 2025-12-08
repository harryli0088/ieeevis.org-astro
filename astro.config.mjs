// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  base: `/year/${process.env.DEPLOY_YEAR}`,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
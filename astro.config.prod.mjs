// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

if(!process.env.DEPLOY_YEAR) throw new Error("You must specify a DEPLOY_YEAR environment variable")

// https://astro.build/config
export default defineConfig({
  base: `/year/${process.env.DEPLOY_YEAR}`,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
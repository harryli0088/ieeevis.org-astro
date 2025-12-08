// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

let base = "/";
if(process.env.NODE_ENV === "production") {
  if(!process.env.DEPLOY_YEAR) {
    throw new Error("You must specify a DEPLOY_YEAR environment variable");
  }
  base = `/year/${process.env.DEPLOY_YEAR}`;
  console.log("BASE",base)
}

// https://astro.build/config
export default defineConfig({
  base,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://boostseo.co.nz', // Production domain
  output: 'server',
  adapter: netlify(),
  
  // Performance optimizations
  build: {
    inlineStylesheets: 'auto',
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            stripe: ['@stripe/stripe-js']
          }
        }
      }
    }
  },

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // We handle this in global.css
    }),
    sitemap()
  ]
});
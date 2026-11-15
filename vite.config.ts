import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// This site is server-rendered at build time (site/build/render.mjs uses
// react-dom/server) — Vite here only bundles the small client-side "islands"
// that hydrate specific interactive widgets (research.md R1/R3). Output goes
// to assets/site/ so nginx's existing /assets/ location block (immutable,
// 1y cache) serves it with no config change (FR-010).
export default defineConfig({
  root: resolve(__dirname, 'site'),
  base: '/assets/site/',
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'assets/site'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        theme: resolve(__dirname, 'site/src/islands/theme.tsx'),
        'email-protection': resolve(__dirname, 'site/src/islands/email-protection.ts'),
        'cv-modal': resolve(__dirname, 'site/src/islands/cv-modal.ts'),
        'catalog-filter': resolve(__dirname, 'site/src/islands/catalog-filter.ts'),
        'home-skill-toggle': resolve(__dirname, 'site/src/islands/home-skill-toggle.ts'),
        'scroll-to-top': resolve(__dirname, 'site/src/islands/scroll-to-top.ts'),
      },
      output: {
        // pdf.js worker ships as .mjs. nginx's default MIME for .mjs is
        // application/octet-stream, which browsers reject as a module worker.
        // Emit it as .js so Content-Type is application/javascript everywhere.
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
          if (name.includes('pdf.worker')) {
            return 'assets/[name]-[hash].js';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});

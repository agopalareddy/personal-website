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
      },
    },
  },
});

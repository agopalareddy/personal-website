import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  outputDir: './test-results/',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://agreddy.com',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 667 },
      },
    },
  ],
});

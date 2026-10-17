import { defineConfig, devices } from '@playwright/test'
import { MEMBERSHIP_TEST_ENDPOINT } from './tests/membership-endpoint'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  outputDir: '.playwright-results',
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    // A dev server started by hand needs the same variable for the membership tests.
    env: { VITE_MEMBERSHIP_FORM_URL: MEMBERSHIP_TEST_ENDPOINT },
  },
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
})

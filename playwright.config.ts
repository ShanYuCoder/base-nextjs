import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

function loadDotenv(): void {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function resolveE2ePort(): string {
  return process.env.E2E_PORT?.trim() || '3005';
}

function resolveE2eBaseUrl(): string {
  const fromEnv = process.env.PLAYWRIGHT_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const port = resolveE2ePort();
  return `http://127.0.0.1:${port}`;
}

loadDotenv();

const e2ePort = resolveE2ePort();
const baseURL = resolveE2eBaseUrl();

process.env.PLAYWRIGHT_BASE_URL = baseURL;
process.env.E2E_PORT = e2ePort;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  outputDir: 'test-results',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'pnpm dev:test',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ...process.env,
          E2E_PORT: e2ePort,
          PORT: e2ePort,
        },
      },
});

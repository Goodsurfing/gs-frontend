import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from './e2e/config';

export default defineConfig({
    testDir: './e2e/tests',
    globalSetup: './e2e/global-setup.ts',

    fullyParallel: false,
    retries: 1,
    timeout: 30_000,

    reporter: [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: BASE_URL,
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        {
            name: 'setup',
            testMatch: /global-setup\.ts/,
        },
        {
            name: 'vol',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'e2e/.auth/vol.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'host',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'e2e/.auth/host.json',
            },
            dependencies: ['setup'],
        },
        // Визуальные эталоны публичных страниц (GS-214): только по явному
        // E2E_VISUAL=1, в обычный прогон после деплоя не входят. Снимки —
        // в e2e/visual/__snapshots__ (не в git), порядок — e2e/README.md.
        ...(process.env.E2E_VISUAL === '1' ? [{
            name: 'visual',
            testDir: './e2e/visual',
            snapshotPathTemplate: 'e2e/visual/__snapshots__/{arg}{ext}',
            use: {
                ...devices['Desktop Chrome'],
                storageState: { cookies: [], origins: [] },
            },
        }] : []),
    ],
});

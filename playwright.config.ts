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
    ],
});

import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from '../config';

/**
 * Демо фич для релиза: видео и скриншоты сценариев на стейдже.
 * Запуск и склейка видео — e2e/demos/README.md. В обычный прогон e2e не входят.
 */
export default defineConfig({
    testDir: '.',
    testMatch: /\.demo\.ts$/,
    fullyParallel: false,
    retries: 0,
    workers: 1,
    reporter: [['list']],
    outputDir: './output/.playwright',
    use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
        ignoreHTTPSErrors: true,
        launchOptions: { slowMo: 150 },
    },
});

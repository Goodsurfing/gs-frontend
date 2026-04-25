import { test, expect } from '@playwright/test';

test.describe('Smoke — волонтёр', () => {
    test.use({ storageState: 'e2e/.auth/vol.json' });

    test('главная страница загружается', async ({ page }) => {
        await page.goto('/ru');
        await expect(page).not.toHaveTitle(/404|error/i);
    });

    test('профиль доступен', async ({ page }) => {
        await page.goto('/ru/profile');
        await expect(page.locator('body')).not.toContainText('Forbidden');
    });
});

test.describe('Smoke — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    test('главная страница загружается', async ({ page }) => {
        await page.goto('/ru');
        await expect(page).not.toHaveTitle(/404|error/i);
    });

    test('дашборд организации доступен', async ({ page }) => {
        await page.goto('/ru/profile');
        await expect(page.locator('body')).not.toContainText('Forbidden');
    });
});

import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: каталог сборов /donation-map — фильтры в адресе, список, карта. */
test.describe('Новый фронт: карта сборов', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test('список ведёт на сборы, фильтры и сортировка — в адресе, карта получает точки', async ({ page }) => {
        const points = page.waitForResponse((response) => response.url().includes('/web/api/map-fundraises'));
        const response = await page.goto('/donation-map');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        expect((await points).ok()).toBe(true);

        await expect(page.getByText(/\d+ вариант/)).toBeVisible();
        const card = page.locator('a[href^="/fundraise/"]').first();
        await expect(card).toBeVisible();

        // Второй список — в мобильной раскладке, скрыт
        await page.getByLabel('По срочности').locator('visible=true').selectOption('popular');
        await expect(page).toHaveURL(/sort=popular/);

        await page.getByRole('switch', { name: 'Показать завершенные проекты' }).click();
        await page.getByRole('button', { name: 'Применить' }).click();
        await expect(page).toHaveURL(/closed=1/);

        await page.getByRole('button', { name: 'Очистить все' }).click();
        await expect(page).toHaveURL(/\/donation-map$/);
    });
});

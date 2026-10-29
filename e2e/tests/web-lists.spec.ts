import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: разделы-списки (журналы, новости, блог, видео) — сортировка и страницы в адресе. */
test.describe('Новый фронт: списки', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    test('/journals: сортировка и страницы — ссылками с параметрами', async ({ page }) => {
        const response = await page.goto('/journals');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { level: 1, name: 'Журналы' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Свежее' })).toHaveAttribute('aria-current', 'true');

        await page.getByRole('link', { name: 'Популярное' }).click();
        await expect(page).toHaveURL(/\/journals\?sort=popular$/);
        await expect(page.getByRole('link', { name: 'Популярное' })).toHaveAttribute('aria-current', 'true');

        const pages = page.getByRole('navigation', { name: 'Страницы' });
        test.skip(await pages.getByRole('link', { name: '2', exact: true }).count() === 0, 'одна страница журналов');
        await pages.getByRole('link', { name: '2', exact: true }).click();
        await expect(page).toHaveURL(/\/journals\?sort=popular&page=2$/);
        await expect(pages.getByRole('link', { name: '2', exact: true })).toHaveAttribute('aria-current', 'page');
        expect(await page.locator('main a[href*="/journals/"]').count()).toBeGreaterThan(0);
    });
});

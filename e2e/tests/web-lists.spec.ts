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

    test('/news: поиск обновляет адрес, категория фильтрует и снимается повторным нажатием', async ({ page }) => {
        const response = await page.goto('/news');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { level: 1, name: 'Новости' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/membership');

        await page.getByRole('searchbox', { name: 'Поиск' }).fill('несуществующая-строка-поиска');
        await expect(page).toHaveURL(/\/news\?search=/);
        await expect(page.getByText('Новости не найдены')).toBeVisible();

        await page.goto('/news');
        const chip = page.locator('main a[href*="category="]').first();
        test.skip(await chip.count() === 0, 'нет категорий');
        await chip.click();
        await expect(page).toHaveURL(/category=\d+/);
        const selected = page.locator('main a[aria-current="true"][href="/news"]');
        await expect(selected).toHaveCount(1);
        await selected.click();
        await expect(page).toHaveURL(/\/news$/);
    });

    test('/blog: популярное, кнопка «Добавить статью»', async ({ page }) => {
        const response = await page.goto('/blog?sort=popular');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { level: 1, name: 'Блог' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Популярное' })).toHaveAttribute('aria-current', 'true');
        await expect(page.getByRole('link', { name: 'Добавить статью' })).toHaveAttribute('href', '/volunteer/create-article');
        expect(await page.locator('main a[href^="/blog/"]').count()).toBeGreaterThan(0);
    });
});

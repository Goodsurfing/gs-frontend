import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: «Категории» и «Видео». */
test.describe('Новый фронт: категории и видео', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test('/categories: направления с числом вакансий ведут в каталог', async ({ page }) => {
        const response = await page.goto('/categories');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { level: 1, name: 'Выбирайте по интересам' })).toBeVisible();
        const tile = page.locator('a[href^="/offers-map?category="]').first();
        await expect(tile).toContainText(/\d+ ваканси/);
    });

    test('/video: список, сортировка в адресе, окно «Добавить видео» проверяет поля', async ({ page }) => {
        const response = await page.goto('/video');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { level: 1, name: 'Видео' })).toBeVisible();
        await expect(page.locator('a[href^="/video/"]').first()).toBeVisible();
        await page.getByRole('link', { name: 'Популярное' }).click();
        await expect(page).toHaveURL(/sort=popular/);

        await page.getByRole('button', { name: 'Добавить видео' }).click();
        const dialog = page.getByRole('dialog', { name: 'Добавить видео' });
        await dialog.getByRole('button', { name: 'Опубликовать' }).click();
        await expect(dialog.getByText('Название обязательно')).toBeVisible();
        await expect(dialog.getByText('Выберите категорию')).toBeVisible();
    });
});

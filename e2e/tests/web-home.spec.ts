import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: главная (MainPage старого фронта). */
test.describe('Новый фронт: главная', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    test('первый экран: подсказки поиска, «Найти» ведёт в каталог, направления и слайдер', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Найди своё путешествие со смыслом');

        const search = page.getByRole('textbox', { name: 'Поиск вакансий' });
        await search.fill('ферма');
        await expect(page.getByRole('button', { name: 'Посмотреть все' })).toBeVisible({ timeout: 10_000 });
        await page.getByRole('button', { name: 'Найти' }).click();
        await expect(page).toHaveURL(/\/offers-map\?search=%D1%84%D0%B5%D1%80%D0%BC%D0%B0/);

        await page.goBack();
        await expect(page.locator('a[href^="/offers-map?category="]')).toHaveCount(7);
        await expect(page.getByRole('link', { name: 'Другие категории' })).toHaveAttribute('href', '/categories');
        await page.getByRole('button', { name: '2', exact: true }).click();
        await expect(page.getByRole('link', { name: 'Стать хостом' })).toBeVisible();
    });

    test('подборки: вакансии, отзывы и статьи ведут на свои страницы', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('a[href^="/offers/"]').filter({ has: page.locator('h4') }).first()).toBeVisible();
        await expect(page.locator('a[href^="/blog/"]').first()).toBeAttached();
        await expect(page.getByRole('link', { name: 'Начать сейчас' })).toHaveAttribute('href', '/profile/role');
        await expect(page.getByRole('link', { name: 'Стать организатором' }).last()).toHaveAttribute('href', '/become-host');
    });
});

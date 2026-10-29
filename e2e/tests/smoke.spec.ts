import { test, expect } from '@playwright/test';

test.describe('Smoke — волонтёр', () => {
    test.use({ storageState: 'e2e/.auth/vol.json' });

    test('главная страница загружается', async ({ page }) => {
        await page.goto('/');
        await expect(page).not.toHaveTitle(/404|error/i);
    });

    test('профиль доступен', async ({ page }) => {
        await page.goto('/profile');
        await expect(page.locator('body')).not.toContainText('Forbidden');
    });
});

test.describe('Smoke — хост', () => {
    test.use({ storageState: 'e2e/.auth/host.json' });

    test('главная страница загружается', async ({ page }) => {
        await page.goto('/');
        await expect(page).not.toHaveTitle(/404|error/i);
    });

    test('дашборд организации доступен', async ({ page }) => {
        await page.goto('/profile');
        await expect(page.locator('body')).not.toContainText('Forbidden');
    });
});

/**
 * Русский — без префикса в адресе (решение 29.10.2026). Старые адреса /ru/…
 * из писем, закладок и поисковиков отвечают постоянным редиректом с теми же
 * параметрами.
 */
test.describe('Адреса без /ru', () => {
    test('/ru/… — 301 на адрес без префикса с параметрами', async ({ request }) => {
        for (const [from, to] of [
            ['/ru', '/'],
            ['/ru/offers-map?category=13', '/offers-map?category=13'],
            ['/ru/rules', '/rules'],
        ]) {
            const response = await request.get(from, { maxRedirects: 0 });
            expect(response.status(), from).toBe(301);
            expect(response.headers().location, from).toBe(to);
        }
    });

    test('английская версия — с префиксом /en', async ({ page }) => {
        await page.goto('/en/rules');
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page).toHaveURL(/\/en\/rules$/);
    });
});

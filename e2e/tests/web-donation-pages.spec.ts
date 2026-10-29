import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: страницы сборов без оплаты — отчётность и рейтинг жертвователей. */
test.describe('Новый фронт: отчётность и рейтинг жертвователей', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('/donation-reports: реквизиты и ссылка на отчёты АНО', async ({ page }) => {
            const response = await page.goto('/donation-reports');
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { level: 1, name: 'Публичная отчётность' })).toBeVisible();
            await expect(page.getByText('ИНН 1655405070', { exact: false })).toBeVisible();
            await expect(page.getByRole('link', { name: 'на странице «О некоммерческой организации»' })).toHaveAttribute('href', '/npo');
        });

        test('/donation-rating: таблица, поиск и сортировка; гостю — без ссылок на профили', async ({ page }) => {
            await page.goto('/donation-rating');
            await expect(page.getByRole('heading', { level: 1, name: 'Рейтинг жертвователей' })).toBeVisible();
            const rows = page.locator('tbody tr');
            await expect(rows.first()).toBeVisible();
            await expect(page.getByRole('columnheader', { name: 'ID' })).toHaveCount(0);
            await expect(rows.first().getByRole('link')).toHaveCount(0);

            await page.getByRole('button', { name: 'По возрастанию' }).click();
            await expect(page.getByRole('button', { name: 'По возрастанию' })).toHaveAttribute('aria-pressed', 'true');
            await page.getByLabel('Сортировка').selectOption({ label: 'По общей сумме пожертвований' });

            await page.getByRole('searchbox', { name: 'Поиск участника' }).fill('такого-участника-нет');
            await expect(page.getByText('Никого не найдено')).toBeVisible();
        });
    });

    test('волонтёр: в рейтинге видны id и ссылки на профили', async ({ page }) => {
        await page.goto('/donation-rating');
        await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
        await expect(page.locator('tbody tr').first().locator('a[href^="/volunteers/"]')).toBeVisible();
    });
});

import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: страница «Членство». Оплата тарифа — отдельная страница /payment. */
test.describe('Новый фронт: членство', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('тарифы с ценами и ссылками на оплату, регистрация, вопросы раскрываются', async ({ page }) => {
            const response = await page.goto('/membership');
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.locator('h1')).toContainText('Стань частью сообщества Гудсёрфинга');

            const volunteer = page.locator('#tariffs');
            await expect(volunteer.getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
            await expect(volunteer.getByRole('link', { name: 'Зарегистрироваться' })).toHaveAttribute('href', '/signup');
            await expect(volunteer).toContainText(/\d[\d\s]* руб\/год/);
            await expect(page.locator('#host').getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=host_4990');
            await expect(page.locator('#international').getByRole('link', { name: /Стать участником/ })).toHaveAttribute('href', '/payment?tariff=international_5000');

            const question = page.getByRole('button', { name: 'Куда идут мои деньги?' });
            await question.click();
            await expect(question).toHaveAttribute('aria-expanded', 'true');
        });
    });

    test('волонтёр: без кнопок регистрации', async ({ page }) => {
        await page.goto('/membership');
        await expect(page.locator('#tariffs').getByRole('link', { name: 'Получить членство' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Зарегистрироваться' })).toHaveCount(0);
    });
});

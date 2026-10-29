import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Новый фронт: оплата членства. Сам платёж здесь не проводится — страница
 * создаёт платёж и уводит на ЮKassa; живая оплата тестовой картой — вручную
 * после выкладки (правило для оплаты).
 */
test.describe('Новый фронт: оплата членства', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('оплата без входа уводит на вход с возвратом к тарифу', async ({ page }) => {
            await page.goto('/payment?tariff=host_4990');
            await expect(page).toHaveURL(/\/signin\?next=payment&nextId=host_4990/);
        });

        test('неудачная оплата: причина и возврат к членству', async ({ page }) => {
            await page.goto('/payment/fail?reason=cancelled');
            await expect(page.getByRole('heading', { level: 1, name: 'Ошибка оплаты' })).toBeVisible();
            await expect(page.getByText('Оплата была отменена')).toBeVisible();
            await expect(page.getByRole('link', { name: 'Вернуться на страницу членства' })).toHaveAttribute('href', '/membership');
        });
    });

    test('волонтёр: создаёт платёж и уводит на ЮKassa (или сообщает, что членство уже есть)', async ({ page }) => {
        await page.goto('/payment?tariff=volunteer_990');
        await expect(async () => {
            const onCheckout = /yoomoney\.ru|yookassa\.ru/.test(page.url());
            const alreadyActive = await page.getByText('У вас уже есть активное членство').isVisible();
            expect(onCheckout || alreadyActive).toBe(true);
        }).toPass({ timeout: 30_000 });
    });
});

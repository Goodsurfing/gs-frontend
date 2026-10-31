import { test, expect, type Page } from '@playwright/test';
import { createSession, useSessionInPage } from '../support/session';
import { enableNewFrontend } from '../support/newFrontend';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/**
 * «Назад» с ЮKassa. Страница /payment сама создаёт платёж при открытии, и
 * раньше «Назад» возвращал на неё же: новый платёж и снова ЮKassa — уйти было
 * нельзя. На проде так набралось втрое больше отменённых платежей, чем попыток.
 * Теперь переход на ЮKassa заменяет /payment в истории, «Назад» ведёт на
 * страницу до оплаты. Сам платёж не проводится.
 */
const backFromCheckout = async (page: Page) => {
    let checkouts = 0;
    page.on('request', (r) => {
        if (r.method() === 'POST' && r.url().endsWith('/api/v1/membership/checkout')) checkouts++;
    });
    await page.goto('/membership');
    await page.goto('/payment?tariff=volunteer_990');
    await page.waitForURL(/yoomoney\.ru|yookassa\.ru/, { timeout: 30_000 });
    await page.goBack();
    await expect(page).toHaveURL(/\/membership/);
    // Подождать: если бы открылся /payment, он успел бы создать платёж
    await page.waitForTimeout(3_000);
    expect(checkouts).toBe(1);
    await expect(page).toHaveURL(/\/membership/);
};

test.describe('Оплата членства: «Назад» с ЮKassa', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        test.setTimeout(90_000);
    });

    test.describe('старый сайт', () => {
        // Свой пользователь без членства — не зависеть от состояния vol@test.com
        test.use({ storageState: { cookies: [], origins: [] } });

        test('возвращает к тарифам, новый платёж не создаётся', async ({ page }) => {
            await useSessionInPage(page, await createSession('back', { volunteer: true }));
            await backFromCheckout(page);
        });
    });

    // Новому фронту нужна cookie входа — берём сессию vol@test.com (без членства)
    test('новый фронт: возвращает к тарифам, новый платёж не создаётся', async ({ page, context }) => {
        await enableNewFrontend(context);
        await backFromCheckout(page);
    });
});

import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { authHeaders, createSession, useSessionInPage } from '../support/session';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';
import { payWithTestCard, replayPaymentSucceeded } from '../support/yookassa';

/**
 * GS-214: оплаты через интерфейс сайта — тестовой картой ЮKassa на стейдже
 * (тестовый магазин, деньги не списываются). Пользователи одноразовые.
 */
test.describe('Оплата через интерфейс', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test.describe.configure({ retries: 0 });

    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'настоящий тестовый платёж — один на прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        test.setTimeout(180_000);
    });

    test('международный клуб: «Стать участником» → ЮKassa → членство и строка в профиле', async ({ page }) => {
        const session = await createSession('intl');
        await useSessionInPage(page, session);
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });

        await page.goto('/membership');
        await page.getByRole('button', { name: 'Стать участником международного клуба' })
            .or(page.getByRole('link', { name: 'Стать участником международного клуба' })).first().click();
        const orderId = await payWithTestCard(page);
        await replayPaymentSucceeded(api, orderId);

        const memberships = await (await api.get('/api/v1/membership/current-all', { headers: authHeaders(session) })).json();
        const international = memberships.find((m: { tariff: { category: string } }) => m.tariff.category === 'INTERNATIONAL');
        expect(international?.status).toBe('ACTIVE');

        // GS-198: строка в профиле
        await page.goto('/profile/info');
        // На странице две копии баннера (десктоп и телефон), видна одна
        await expect(page.getByText(/Международный клуб: активно до \d{2}\.\d{2}\.\d{4}/).locator('visible=true').first())
            .toBeVisible({ timeout: 15_000 });
        await api.dispose();
    });

    test('пожертвование в сбор: «Поддержать» → 100 ₽ → ЮKassa → в списке сбора', async ({ page }) => {
        // Жертвовать в сбор может только волонтёр («Чтобы участвовать, станьте гудсёрфером»)
        const session = await createSession('donation', { volunteer: true });
        await useSessionInPage(page, session);
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });

        const e2eDonations = async (id: string) => {
            const body = await (await api.get(`/api/v1/donation/fundraise/${id}/list?page=1&limit=100`)).json();
            const rows: { fullName: string; amount: number }[] = Array.isArray(body) ? body : body?.data ?? [];
            return rows.filter((r) => r.fullName === 'E2E Тест' && r.amount === 100).length;
        };

        const list = await (await api.get('/api/v1/fundraise?page=1&limit=20')).json();
        const fundraises: { id: string }[] = Array.isArray(list) ? list : list?.data ?? [];
        expect(fundraises.length, 'нет сборов на стенде').toBeGreaterThan(0);

        // Первый сбор, у которого есть кнопка «Поддержать» (закрытые её не показывают)
        let fundraiseId: string | undefined;
        for (const { id } of fundraises) {
            await page.goto(`/fundraise/${id}`);
            const donate = page.getByRole('button', { name: 'Поддержать', exact: true }).first();
            const open = await donate.waitFor({ state: 'visible', timeout: 10_000 }).then(() => true, () => false);
            if (open) {
                await donate.click();
                fundraiseId = id;
                break;
            }
        }
        expect(fundraiseId, 'нет открытого сбора').toBeTruthy();

        await page.waitForURL(/\/donation\/pay\//);
        const before = await e2eDonations(fundraiseId as string);
        await page.getByLabel('Другая сумма, ₽').fill('100');
        await page.getByRole('button', { name: /Поддержать — 100/ }).click();
        const orderId = await payWithTestCard(page);
        await replayPaymentSucceeded(api, orderId);

        // Пожертвование появилось в публичном списке сбора (одноразовые пользователи — «E2E Тест»)
        await expect.poll(async () => (await e2eDonations(fundraiseId as string)), { timeout: 20_000 })
            .toBeGreaterThan(before);
        await api.dispose();
    });
});

import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { authHeaders, createSession, useSessionInPage } from '../support/session';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/** GS-214: избранное через интерфейс — на одноразовом пользователе. */
test.describe('Избранное', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('добавить с карты → видно в «Избранном» → убрать', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        test.setTimeout(90_000);

        const session = await createSession('favorites');
        await useSessionInPage(page, session);
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const favoriteIds = async () => {
            const body = await (await api.get('/api/v1/favorites/vacancies/ids', { headers: authHeaders(session) })).json();
            return (Array.isArray(body) ? body : body?.ids ?? body?.data ?? []) as number[];
        };

        await page.goto('/ru/offers-map');
        // exact: вся карточка — role="button", её имя включает подпись сердечка
        const add = page.getByRole('button', { name: 'Добавить в избранное', exact: true }).first();
        await add.click();
        await expect.poll(async () => (await favoriteIds()).length, { timeout: 15_000 }).toBe(1);
        await expect(page.getByRole('button', { name: 'Убрать из избранного', exact: true }).first())
            .toHaveAttribute('aria-pressed', 'true');

        await page.goto('/ru/favorite-offers');
        await expect(page.getByRole('button', { name: 'Убрать из избранного', exact: true })).toHaveCount(1, { timeout: 15_000 });
        await page.getByRole('button', { name: 'Убрать из избранного', exact: true }).click();
        await expect.poll(async () => (await favoriteIds()).length, { timeout: 15_000 }).toBe(0);
        await api.dispose();
    });
});

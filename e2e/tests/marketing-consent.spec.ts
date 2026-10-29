import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { e2eHeaders, hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/**
 * GS-203: согласие на email-рассылку. Чекбокс при регистрации (по умолчанию
 * снят), переключатель на странице «Приватность», страница подписки по
 * ссылке из письма-запроса.
 */
test.describe('Согласие на рассылку', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
    });

    test('регистрация с отметкой → согласие в профиле → выключение в «Приватности»', async ({ page }) => {
        const email = `e2e-consent-${Date.now()}@test.local`;
        const password = 'E2eConsent2026x';

        await page.goto('/signup');
        const checkbox = page.getByRole('checkbox', { name: /Хочу получать письма/ });
        await expect(checkbox).not.toBeChecked();
        await page.getByLabel('E-mail').fill(email);
        await page.getByLabel('Пароль', { exact: true }).first().fill(password);
        await checkbox.check();
        await page.locator('form button[type="submit"]').click();
        await expect(page).toHaveURL(/confirm-email/, { timeout: 20_000 });

        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        expect((await api.post('/api/test/verify-email', { data: { email }, headers: e2eHeaders() })).ok()).toBeTruthy();
        const login = await (await api.post('/api/v1/token', { data: { email, password } })).json();
        const auth = { Authorization: `Bearer ${login.accessToken}` };
        expect((await (await api.get('/api/v1/profile', { headers: auth })).json()).marketingConsent).toBe(true);

        // Вход в браузере и переключатель в «Приватности»
        await page.goto('/signin');
        await page.getByLabel('E-mail').fill(email);
        await page.getByLabel('Пароль', { exact: true }).first().fill(password);
        await page.locator('form button[type="submit"]').click();
        await expect(page).not.toHaveURL(/\/signin/, { timeout: 20_000 });

        await page.goto('/profile/privacy');
        const toggle = page.getByRole('checkbox', { name: /Получать рассылку/ });
        await expect(toggle).toBeChecked({ timeout: 15_000 });
        await toggle.click();
        await expect(toggle).not.toBeChecked();
        await expect.poll(async () => (await (await api.get('/api/v1/profile', { headers: auth })).json()).marketingConsent, { timeout: 10_000 }).toBe(false);
        await api.dispose();
    });

    test('регистрация без отметки — согласия нет', async () => {
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const email = `e2e-noconsent-${Date.now()}@test.local`;
        const created = await api.post('/api/test/create-user', { data: { email, password: 'E2eConsent2026x' }, headers: e2eHeaders() });
        expect(created.ok()).toBeTruthy();
        const login = await (await api.post('/api/v1/token', { data: { email, password: 'E2eConsent2026x' } })).json();
        const profile = await (await api.get('/api/v1/profile', { headers: { Authorization: `Bearer ${login.accessToken}` } })).json();
        expect(profile.marketingConsent).toBe(false);
        await api.dispose();
    });
});

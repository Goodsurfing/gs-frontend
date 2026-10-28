import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { hasMailpit, linkByText, waitForEmail } from '../support/mailpit';
import { e2eHeaders, hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/**
 * GS-214: вход и регистрация через интерфейс, письма — из Mailpit стейджа.
 * Пользователи одноразовые (@test.local), общие vol@/host@ не трогаем.
 * Поля форм в старом фронте не подписаны (у всех name="main"), поэтому ищем
 * их по типу; в новом фронте у полей будут label и name.
 */
test.describe('Авторизация', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
    });

    test('регистрация → письмо → подтверждение почты → вход', async ({ page }) => {
        test.skip(!hasMailpit(), 'нет MAILPIT_USER / MAILPIT_PASSWORD');
        test.setTimeout(120_000);
        const email = `e2e-signup-${Date.now()}@test.local`;
        const password = 'E2eSignup2026';

        await page.goto('/ru/signup');
        await page.locator('form input[type="email"]').fill(email);
        await page.locator('form input[type="password"]').first().fill(password);
        await page.locator('form button[type="submit"]').click();
        await expect(page).toHaveURL(/\/ru\/confirm-email/);

        const { html } = await waitForEmail(email);
        await page.goto(linkByText(html, 'Подтвердить почту'));
        await expect(page).toHaveURL(/confirm-email-success|profile/, { timeout: 20_000 });

        await page.goto('/ru/signin');
        await page.locator('form input[type="email"]').fill(email);
        await page.locator('form input[type="password"]').first().fill(password);
        await page.locator('form button[type="submit"]').click();
        await expect(page).not.toHaveURL(/\/signin/, { timeout: 20_000 });
        expect(await page.evaluate(() => localStorage.getItem('token'))).toBeTruthy();
    });

    test('вход с неверным паролем — ошибка, остаёмся на странице входа', async ({ page }) => {
        await page.goto('/ru/signin');
        await page.locator('form input[type="email"]').fill('vol@test.com');
        await page.locator('form input[type="password"]').first().fill('wrong-password-1');
        await page.locator('form button[type="submit"]').click();
        await expect(page).toHaveURL(/\/ru\/signin/);
        await expect(page.locator('body')).toContainText(/неверн|Неверн|ошибк/);
    });

    test('сброс пароля по ссылке из письма', async ({ page }) => {
        test.skip(!hasMailpit(), 'нет MAILPIT_USER / MAILPIT_PASSWORD');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        test.setTimeout(120_000);
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const email = `e2e-reset-${Date.now()}@test.local`;
        const created = await api.post('/api/test/create-user', {
            data: { email, password: 'E2eOld2026' },
            headers: e2eHeaders(),
        });
        expect(created.ok(), await created.text()).toBeTruthy();

        await page.goto('/ru/reset-password');
        await page.locator('form input[type="email"]').fill(email);
        await page.getByRole('button', { name: 'Отправить' }).click();

        const { html } = await waitForEmail(email);
        await page.goto(linkByText(html, 'Восстановление пароля'));
        await expect(page).toHaveURL(/reset-password-verify/, { timeout: 20_000 });

        const newPassword = 'E2eNew2026x';
        await page.locator('form input[type="password"]').first().fill(newPassword);
        await page.locator('form input[type="password"]').nth(1).fill(newPassword);
        await page.locator('form button[type="submit"]').click();

        await expect.poll(async () => (await api.post('/api/v1/token', {
            data: { email, password: newPassword },
        })).ok(), { timeout: 20_000 }).toBe(true);
        await api.dispose();
    });
});

import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';
import { createSession } from '../support/session';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/**
 * Новый фронт: вход и регистрация. Вход пишет сессию в формате старого SPA
 * (localStorage) — проверяем, что после входа в новом фронте кабинет
 * старого SPA открывается вошедшим.
 */
test.describe('Новый фронт: вход и регистрация', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        await enableNewFrontend(context);
    });

    test('вход по почте и паролю ведёт туда, откуда пришли, и виден старому SPA', async ({ page }) => {
        const session = await createSession('web-signin');
        await page.goto('/signin?next=offer&nextId=1');
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await page.getByLabel('E-mail').fill(session.email);
        await page.getByLabel('Пароль', { exact: true }).fill(session.password);
        await page.getByRole('button', { name: 'Войти', exact: true }).click();
        await expect(page).toHaveURL(/\/offers\/1$/, { timeout: 20_000 });
        const token = await page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null'));
        expect(token).toBeTruthy();

        await page.goto('/profile/info');
        await expect(page).not.toHaveURL(/\/signin/, { timeout: 15_000 });
    });

    test('неверный пароль — сообщение, остаёмся на входе', async ({ page }) => {
        const session = await createSession('web-signin-bad');
        await page.goto('/signin');
        await page.getByLabel('E-mail').fill(session.email);
        await page.getByLabel('Пароль', { exact: true }).fill('wrong-password-1');
        await page.getByRole('button', { name: 'Войти', exact: true }).click();
        // Сообщение об ошибке (не путать с пустым объявлением маршрута Next)
        await expect(page.getByRole('alert').filter({ hasText: /\S/ })).toBeVisible();
        await expect(page).toHaveURL(/\/signin/);
    });

    test('регистрация проверяет пароль; ссылки на восстановление и вход', async ({ page }) => {
        await page.goto('/signup');
        await expect(page.getByRole('heading', { name: 'Регистрация пользователя' })).toBeVisible();
        await expect(page.getByLabel('Хочу получать письма о новых проектах, акциях и новостях Гудсёрфинга')).toBeChecked();
        await page.getByLabel('E-mail').fill(`e2e-web-signup-${Date.now()}@test.local`);
        await page.getByLabel('Пароль', { exact: true }).fill('short');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.getByText('Пароль должен содержать минимум 6 символов', { exact: false })).toBeVisible();
        await expect(page).toHaveURL(/\/signup/);

        await page.goto('/signin');
        await expect(page.getByRole('link', { name: 'Забыли пароль?' })).toHaveAttribute('href', '/reset-password');
        await expect(page.getByRole('link', { name: 'Зарегистрироваться' })).toHaveAttribute('href', '/signup');
    });

    test('страницы из писем: ошибка ссылки, почта уже подтверждена, отписка', async ({ page }) => {
        await page.goto('/confirm-error');
        await expect(page.getByRole('link', { name: 'Попробуйте ещё раз.' })).toHaveAttribute('href', '/signin');
        await page.goto('/email-already-confirmed');
        await expect(page.getByRole('link', { name: 'Перейти ко входу' })).toBeVisible();
        await page.goto('/unsubscribed?status=invalid');
        await expect(page.getByText('Ссылка для отписки неверна', { exact: false })).toBeVisible();
    });
});

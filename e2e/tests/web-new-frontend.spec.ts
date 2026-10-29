import { test, expect, type BrowserContext } from '@playwright/test';
import { API_URL, BASE_URL } from '../config';
import { createSession, useSessionInPage } from '../support/session';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/**
 * Новый фронт (эпик GS-212) за канарейкой: Traefik отдаёт перенесённые
 * адреса новому приложению только с cookie gs_web=1. Здесь проверяется
 * именно новый фронт; без cookie те же адреса отдаёт старое SPA и их
 * проверяют остальные тесты.
 */
const enableNewFrontend = async (context: BrowserContext) => {
    await context.addCookies([{ name: 'gs_web', value: '1', url: BASE_URL }]);
};

const PAGE = '/payment-security-policy';

test.describe('Новый фронт: политика безопасности платежей', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    test('отдаёт новый фронт: заголовок, логотипы, ссылка на ЮKassa, мета-теги', async ({ page }) => {
        const response = await page.goto(`/ru${PAGE}`);
        expect(response?.status()).toBe(200);
        // Признак нового фронта — скрипты Next
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();

        await expect(page.getByRole('heading', { level: 1, name: 'Политика безопасности платежей' })).toBeVisible();
        for (const alt of ['Visa', 'MasterCard', 'МИР']) {
            await expect(page.getByRole('img', { name: alt })).toBeVisible();
        }
        await expect(page.getByRole('link', { name: 'ЮKassa' }).first()).toHaveAttribute('href', 'https://yookassa.ru/');
        await expect(page.getByRole('note')).toHaveCount(0);

        await expect(page).toHaveTitle('Безопасность платежей — GoodSurfing');
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/ru\/payment-security-policy$/);
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /\/ru\/payment-security-policy$/);
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.jpg$/);
    });

    test('en и es: переведённый текст и плашка про неофициальный перевод', async ({ page }) => {
        await page.goto(`/en${PAGE}`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Политика безопасности платежей');
        await expect(page.getByRole('note')).toBeVisible();
        await expect(page.getByRole('img', { name: 'Mir' })).toBeVisible();

        await page.goto(`/es${PAGE}`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'es');
        await expect(page.getByRole('note')).toBeVisible();
    });

    test('гость видит «Вход», переключатель языка ведёт на ту же страницу', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`/ru${PAGE}`);
        await expect(page.locator('header').getByRole('link', { name: 'Вход' })).toBeVisible();

        await page.locator('header').first().getByRole('button', { name: 'Язык: Русский' }).click();
        await expect(page.getByRole('menuitem', { name: 'English' })).toHaveAttribute('href', `/en${PAGE}`);
    });
});

test.describe('Новый фронт: шапка вошедшего пользователя', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        await enableNewFrontend(context);
    });

    test('вход в старом SPA (localStorage) — в новом фронте тоже вошёл', async ({ page }) => {
        const session = await createSession('web-legacy');
        await useSessionInPage(page, session);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`/ru${PAGE}`);

        const header = page.locator('header').first();
        await expect(header.getByRole('link', { name: /^Сообщения/ })).toBeVisible({ timeout: 15_000 });
        await expect(header.getByRole('link', { name: 'Вход' })).toHaveCount(0);
    });

    test('вход через cookie: меню профиля и выход из обоих фронтов', async ({ page }) => {
        const session = await createSession('web-cookie');
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`/ru${PAGE}`);
        // Вход как в браузере: запрос со страницы стейджа — бэкенд ставит cookie входа
        const status = await page.evaluate(async ({ api, email, password }) => (await fetch(`${api}/api/v1/token`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })).status, { api: API_URL, email: session.email, password: session.password });
        expect(status).toBe(201);

        await page.reload();
        const header = page.locator('header').first();
        const profileButton = header.getByRole('button', { name: new RegExp(session.email.slice(0, 13).replace(/[.+]/g, '\\$&')) });
        await expect(profileButton).toBeVisible({ timeout: 15_000 });
        await profileButton.click();
        await expect(page.getByRole('menuitem', { name: 'Обо мне' })).toHaveAttribute('href', '/ru/profile/info');

        await page.getByRole('menuitem', { name: 'Выход' }).click();
        await expect(header.getByRole('link', { name: 'Вход' })).toBeVisible({ timeout: 15_000 });
        const cookies = await page.context().cookies();
        expect(cookies.some((c) => c.name.startsWith('gs_access'))).toBe(false);
    });
});

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
        const response = await page.goto(`${PAGE}`);
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
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\/[^/]+\/payment-security-policy$/);
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', /^https?:\/\/[^/]+\/payment-security-policy$/);
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /^https?:\/\/[^/]+\/en\/payment-security-policy$/);
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
        await page.goto(`${PAGE}`);
        await expect(page.locator('header').getByRole('link', { name: 'Вход' })).toBeVisible();

        await page.locator('header').first().getByRole('button', { name: 'Язык: Русский' }).click();
        await expect(page.getByRole('menuitem', { name: 'English' })).toHaveAttribute('href', `/en${PAGE}`);
    });
});

const LEGAL_PAGES = [
    { path: '/rules', heading: 'Правила', title: 'Правила сервиса — GoodSurfing', section: '5. Контент и правила его использования' },
    { path: '/privacy-policy', heading: 'Политика конфиденциальности', title: 'Политика конфиденциальности — GoodSurfing', section: '5. Порядок и условия обработки персональных данных' },
];

test.describe('Новый фронт: правила и политика конфиденциальности', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    for (const doc of LEGAL_PAGES) {
        test(`${doc.path}: новый фронт, оглавление ведёт к разделу`, async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            const response = await page.goto(doc.path);
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { level: 1, name: doc.heading })).toBeVisible();
            await expect(page).toHaveTitle(doc.title);
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`^https?://[^/]+${doc.path}$`));

            const toc = page.getByRole('navigation', { name: doc.heading });
            await toc.getByRole('link', { name: doc.section }).click();
            await expect(page).toHaveURL(new RegExp(`${doc.path}#5$`));
            await expect(page.getByRole('heading', { level: 2, name: doc.section })).toBeInViewport();
            await expect(toc.getByRole('link', { name: doc.section })).toHaveAttribute('aria-current', 'location');
        });

        test(`${doc.path}: en и es — плашка про неофициальный перевод`, async ({ page }) => {
            for (const locale of ['en', 'es']) {
                await page.goto(`/${locale}${doc.path}`);
                await expect(page.locator('html')).toHaveAttribute('lang', locale);
                await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(doc.heading);
                await expect(page.getByRole('note')).toBeVisible();
            }
        });
    }
});

test.describe('Новый фронт: о некоммерческой организации', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    test('/npo: отчёты-PDF, уставные документы открываются крупно', async ({ page }) => {
        const response = await page.goto('/npo');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { level: 1, name: 'О некоммерческой организации' })).toBeVisible();

        // 6 отчётов в Минюст (2018–2023) + 7 о деятельности (2019–2025)
        const reports = page.locator('main a[href^="/assets/docs/npo/"]');
        await expect(reports).toHaveCount(13);
        const pdf = await page.request.get(await reports.first().getAttribute('href') as string);
        expect(pdf.headers()['content-type']).toContain('pdf');

        await page.getByRole('button', { name: 'Уставные документы 1' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
    });
});

test.describe('Новый фронт: найти работу', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    test('/find-job: ссылки, шаги, слайдер вакансий листается', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const response = await page.goto('/find-job');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page).toHaveTitle('Сезонная работа в путешествии — GoodSurfing');

        await expect(page.getByRole('link', { name: 'Найти работу' })).toHaveAttribute('href', '/offers-map?category=13');
        await expect(page.getByRole('main').getByRole('link', { name: 'Как это работает', exact: true })).toHaveAttribute('href', '/membership');
        await expect(page.getByRole('link', { name: 'Разместить вакансию' })).toHaveAttribute('href', '/profile/role');
        await expect(page.getByRole('heading', { level: 4, name: 'Путешествие' })).toBeVisible();

        // Слайдер: карточки вакансий категории «Оплачиваемая работа», стрелка листает
        const cards = page.locator('a[href^="/offers/"]').filter({ has: page.locator('h4') });
        expect(await cards.count()).toBeGreaterThan(3);
        const track = cards.first().locator('xpath=../..');
        await page.getByRole('button', { name: 'Вперёд' }).click();
        await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(300);
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
        await page.goto(`${PAGE}`);

        const header = page.locator('header').first();
        await expect(header.getByRole('link', { name: /^Сообщения/ })).toBeVisible({ timeout: 15_000 });
        await expect(header.getByRole('link', { name: 'Вход' })).toHaveCount(0);
    });

    test('вход через cookie: меню профиля и выход из обоих фронтов', async ({ page }) => {
        const session = await createSession('web-cookie');
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`${PAGE}`);
        // Вход как в браузере: запрос со страницы стейджа — бэкенд ставит cookie входа
        const status = await page.evaluate(async ({ api, email, password }) => (await fetch(`${api}/api/v1/token`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })).status, { api: API_URL, email: session.email, password: session.password });
        expect(status).toBe(201);

        // Имя в шапке — как в старом фронте: имя профиля или начало email (13 символов)
        const profile = await (await page.request.get(`${API_URL}/api/v1/profile`, {
            headers: { Authorization: `Bearer ${session.accessToken}` },
        })).json();
        const shown = (profile.firstName || profile.email).slice(0, 13);

        await page.reload();
        const header = page.locator('header').first();
        const profileButton = header.getByRole('button', { name: shown });
        await expect(profileButton).toBeVisible({ timeout: 15_000 });
        await profileButton.click();
        await expect(page.getByRole('menuitem', { name: 'Обо мне' })).toHaveAttribute('href', '/profile/info');

        await page.getByRole('menuitem', { name: 'Выход' }).click();
        await expect(header.getByRole('link', { name: 'Вход' })).toBeVisible({ timeout: 15_000 });
        const cookies = await page.context().cookies();
        expect(cookies.some((c) => c.name.startsWith('gs_access'))).toBe(false);
    });
});

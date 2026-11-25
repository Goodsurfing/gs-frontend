import { test, expect, type Browser, type TestInfo } from '@playwright/test';
import { BASE_URL } from '../config';

/**
 * Сайт на экране «Домой» iPhone (решение владельца 24.11.2026): плашка «Установите
 * Гудсёрфинг на iPhone» в кабинете — только в Safari на iPhone и только если сайт
 * открыт не с экрана «Домой»; страница /app; манифест. Настоящего iPhone в CI нет —
 * Safari эмулируется user agent'ом, режим «с экрана Домой» — navigator.standalone.
 */
const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const HINT = 'Как установить на iPhone';

const iphone = async (browser: Browser, testInfo: TestInfo, standalone = false) => {
    const context = await browser.newContext({
        userAgent: IPHONE_SAFARI,
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        storageState: testInfo.project.use.storageState as string,
    });
    await context.addCookies([{ name: 'gs_web', value: '1', url: BASE_URL }]);
    if (standalone) {
        await context.addInitScript(() => {
            Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });
            const original = window.matchMedia.bind(window);
            window.matchMedia = (query: string) => query.includes('display-mode: standalone')
                ? ({ matches: true, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false } as MediaQueryList)
                : original(query);
        });
    }
    return context;
};

test.describe('Новый фронт: сайт на экране «Домой» iPhone', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'кабинет волонтёра; один прогон');
    });

    test('Safari на iPhone: плашка в кабинете, инструкция открывается, «Позже» прячет', async ({ browser }, testInfo) => {
        const context = await iphone(browser, testInfo);
        const page = await context.newPage();
        await page.goto('/volunteer/volunteer-dashboard');
        await page.evaluate(() => {
            localStorage.removeItem('gs-install-hint-dismissed');
            localStorage.removeItem('gs-install-hint-shown');
            sessionStorage.removeItem('gs-install-hint-session');
        });
        await page.reload();

        const hint = page.getByRole('region', { name: HINT });
        await expect(hint).toBeVisible();
        // В том же визите плашка остаётся и на других страницах кабинета
        await page.goto('/profile/info');
        await expect(hint).toBeVisible();
        await hint.getByRole('button', { name: 'Как установить' }).click();
        const dialog = page.getByRole('dialog', { name: HINT });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('listitem')).toHaveCount(4);
        await expect(dialog).toContainText('«Поделиться»');
        await expect(dialog).toContainText('«На экран „Домой“»');
        await expect(dialog.getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '/app');
        await dialog.getByRole('button', { name: 'Понятно' }).click();
        await expect(dialog).toHaveCount(0);

        await hint.getByRole('button', { name: 'Позже' }).click();
        await expect(page.getByRole('region', { name: HINT })).toHaveCount(0);
        await page.reload();
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: HINT })).toHaveCount(0);
        await context.close();
    });

    test('без «Позже»: в новом визите в течение 7 дней плашки нет', async ({ browser }, testInfo) => {
        const context = await iphone(browser, testInfo);
        const page = await context.newPage();
        await page.goto('/volunteer/volunteer-dashboard');
        await page.evaluate(() => {
            localStorage.removeItem('gs-install-hint-dismissed');
            localStorage.setItem('gs-install-hint-shown', String(Date.now() - 3600_000));
            sessionStorage.removeItem('gs-install-hint-session');
        });
        await page.reload();
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: HINT })).toHaveCount(0);
        await page.evaluate(() => localStorage.removeItem('gs-install-hint-shown'));
        await context.close();
    });

    test('открыт с экрана «Домой» — плашки нет', async ({ browser }, testInfo) => {
        const context = await iphone(browser, testInfo, true);
        const page = await context.newPage();
        await page.goto('/volunteer/volunteer-dashboard');
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: HINT })).toHaveCount(0);
        await context.close();
    });

    test('обычный компьютер — плашки нет', async ({ page, context }) => {
        await context.addCookies([{ name: 'gs_web', value: '1', url: BASE_URL }]);
        await page.goto('/volunteer/volunteer-dashboard');
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: HINT })).toHaveCount(0);
    });

    test('страница /app на трёх языках и манифест', async ({ page, request }) => {
        await page.goto('/app');
        await expect(page.getByRole('heading', { level: 1, name: 'Гудсёрфинг на телефоне' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'iPhone' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Android' })).toBeVisible();
        await expect(page.getByText('RuStore')).toBeVisible();
        await page.goto('/en/app');
        await expect(page.getByRole('heading', { level: 1, name: 'Goodsurfing on your phone' })).toBeVisible();
        await page.goto('/es/app');
        await expect(page.getByRole('heading', { level: 1, name: 'Goodsurfing en tu teléfono' })).toBeVisible();

        const manifest = await (await request.get('/web/manifest.webmanifest')).json();
        expect(manifest).toMatchObject({ display: 'standalone', scope: '/', start_url: '/?utm_source=pwa' });
        expect(manifest.icons.some((icon: { purpose: string }) => icon.purpose === 'maskable')).toBe(true);
        expect((await request.get('/web/icons/app/icon-180.png')).ok()).toBe(true);
    });
});

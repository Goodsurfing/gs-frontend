import { test, expect, Page } from '@playwright/test';
import { loadDataPages, STATIC_PAGES, PublicPage } from '../support/publicPages';

/**
 * GS-214: все публичные страницы открываются у гостя без ошибок — это
 * сетка, по которой принимается новый фронт (GS-212). Проверяем:
 * нет необработанных JS-ошибок, нет экрана «Что-то пошло не так»
 * (AppErrorBoundary), нет 404, есть свой заголовок и непустой контент.
 */
// Сбои внешних сервисов, к нашему коду отношения не имеют (тот же список
// игнорирует Bugsink, см. initErrorTracking.ts)
const EXTERNAL_NOISE = [/\(id\.vk\.ru\)/, /ResizeObserver loop/];

test.describe('Публичные страницы — гость', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    const openAndCheck = async (page: Page, url: string) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => {
            if (!EXTERNAL_NOISE.some((pattern) => pattern.test(error.message))) {
                errors.push(error.message);
            }
        });

        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), url).toBeLessThan(400);
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);

        await expect(page.getByRole('alert').filter({ hasText: /Что-то пошло не так|Something went wrong/ }))
            .toHaveCount(0);
        await expect(page.locator('body')).not.toContainText(/Извините, но страница|^404$/);
        expect((await page.locator('main, #root').first().innerText()).trim().length, url).toBeGreaterThan(50);
        expect(errors, `JS-ошибки на ${url}`).toEqual([]);
    };

    for (const { name, path } of STATIC_PAGES) {
        test(`статичная: ${name}`, async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'гостевые проверки — один раз на прогон');
            await openAndCheck(page, `/ru${path}`);
        });
    }

    test('страницы с данными: вакансия, организация, статьи, видео, курс, сбор', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'гостевые проверки — один раз на прогон');
        test.setTimeout(120_000);
        const pages: PublicPage[] = await loadDataPages();
        expect(pages.length, 'API стенда не отдал ни одной записи').toBeGreaterThan(3);
        for (const { path } of pages) {
            await openAndCheck(page, `/ru${path}`);
        }
    });

    test('несуществующая страница — 404', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'гостевые проверки — один раз на прогон');
        await page.goto('/ru/no-such-page-e2e');
        await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    });

    test('язык: /en и /es отдают переведённую страницу', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'гостевые проверки — один раз на прогон');
        await page.goto('/en/categories');
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page).toHaveTitle(/categories/i);

        await page.goto('/es/categories');
        await expect(page.locator('html')).toHaveAttribute('lang', 'es');
        await expect(page).toHaveTitle(/Categorías/);
    });
});

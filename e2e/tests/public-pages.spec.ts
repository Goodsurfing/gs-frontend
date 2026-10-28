import { test, expect } from '@playwright/test';
import { expectPageWorks } from '../support/pageCheck';
import { loadDataPages, STATIC_PAGES, PublicPage } from '../support/publicPages';

/**
 * GS-214: все публичные страницы открываются у гостя без ошибок — это
 * сетка, по которой принимается новый фронт (GS-212). Проверяем:
 * нет необработанных JS-ошибок, нет экрана «Что-то пошло не так»
 * (AppErrorBoundary), нет 404, есть свой заголовок и непустой контент.
 */
test.describe('Публичные страницы — гость', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    for (const { name, path } of STATIC_PAGES) {
        test(`статичная: ${name}`, async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'гостевые проверки — один раз на прогон');
            await expectPageWorks(page, `/ru${path}`, { allowSignin: true });
        });
    }

    test('страницы с данными: вакансия, организация, статьи, видео, курс, сбор', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'гостевые проверки — один раз на прогон');
        test.setTimeout(120_000);
        const pages: PublicPage[] = await loadDataPages();
        expect(pages.length, 'API стенда не отдал ни одной записи').toBeGreaterThan(3);
        for (const { path } of pages) {
            await expectPageWorks(page, `/ru${path}`, { allowSignin: true });
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

import { expect, Page } from '@playwright/test';

// Сбои внешних сервисов, к нашему коду отношения не имеют (тот же список
// игнорирует Bugsink, см. src/shared/lib/initErrorTracking.ts)
const EXTERNAL_NOISE = [/\(id\.vk\.ru\)/, /ResizeObserver loop/];

/**
 * Страница открылась нормально: ответ < 400, нет необработанных JS-ошибок,
 * нет экрана «Что-то пошло не так» (AppErrorBoundary), не 404, не выкинуло
 * на вход и есть контент.
 */
export const expectPageWorks = async (page: Page, url: string, { allowSignin = false } = {}) => {
    const errors: string[] = [];
    const onError = (error: Error) => {
        if (!EXTERNAL_NOISE.some((pattern) => pattern.test(error.message))) {
            errors.push(error.message);
        }
    };
    page.on('pageerror', onError);

    try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), url).toBeLessThan(400);
        await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);

        await expect(page.getByRole('alert').filter({ hasText: /Что-то пошло не так|Something went wrong/ }), url)
            .toHaveCount(0);
        await expect(page.locator('body'), url).not.toContainText(/Извините, но страница|^404$/);
        if (!allowSignin) {
            expect(page.url(), `${url}: выкинуло на страницу входа`).not.toMatch(/\/signin/);
        }
        expect((await page.locator('main, #root').first().innerText()).trim().length, url).toBeGreaterThan(50);
        expect(errors, `JS-ошибки на ${url}`).toEqual([]);
    } finally {
        page.off('pageerror', onError);
    }
};

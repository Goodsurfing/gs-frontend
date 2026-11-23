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
        // Пустые состояния кабинета (нет подписчиков, нет сообщений) короткие — проверяем, что основной блок не пустой
        expect((await page.locator('main, #root').first().innerText()).trim().length, url).toBeGreaterThan(0);
        expect(errors, `JS-ошибки на ${url}`).toEqual([]);
    } finally {
        page.off('pageerror', onError);
    }
};

/**
 * Пункты меню разделов страницы (ссылки «#id») ведут на существующие разделы. Пустые разделы
 * не показываются вместе с пунктом меню (#834), поэтому проверяем соответствие, а не жёсткий
 * список: у случайной организации или волонтёра части разделов может не быть.
 */
export async function expectSectionLinksResolve(page: Page): Promise<string[]> {
    const ids = await page.locator('a[href^="#"]').evaluateAll((links) => links
        .map((link) => decodeURIComponent((link.getAttribute('href') ?? '').slice(1)))
        .filter((id) => id !== ''));
    const unique = [...new Set(ids)];
    for (const id of unique) {
        const found = await page.locator(`[id="${id}"]`).count();
        if (found === 0) throw new Error(`пункт меню «#${id}» ведёт на несуществующий раздел`);
    }
    return unique;
}

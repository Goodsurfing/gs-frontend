import { test, expect, type Page } from '@playwright/test';

/**
 * Медленный интернет (правило владельца 04.11.2026 — учитывать всегда).
 * 1. Бюджет: сколько весят картинки и шрифты при открытии страницы без
 *    прокрутки. Пороги — цифры 04.11 после облегчения с запасом ~30 %:
 *    новая тяжёлая картинка или шрифт ломают тест, а не тихо тормозят сайт.
 * 2. Медленная сеть (50 КБ/с, задержка 400 мс): на первом экране нет
 *    «пустых дыр» — у каждой картинки из хранилища либо загрузка, либо
 *    заглушка, а у ленивых картинок зарезервирована высота.
 */
const KB = 1024;
const BUDGETS: { path: string; images: number; maxImage: number }[] = [
    { path: '/', images: 1400 * KB, maxImage: 200 * KB },
    { path: '/offers-map', images: 600 * KB, maxImage: 120 * KB },
    { path: '/blog', images: 500 * KB, maxImage: 120 * KB },
    { path: '/membership', images: 650 * KB, maxImage: 200 * KB },
    { path: '/become-host', images: 600 * KB, maxImage: 200 * KB },
];
const FONTS_BUDGET = 200 * KB;

const measure = async (page: Page, path: string) => {
    const sizes = { images: 0, fonts: 0, maxImage: 0, maxImageUrl: '' };
    const pending: Promise<void>[] = [];
    page.on('response', (response) => {
        const type = response.request().resourceType();
        if (type !== 'image' && type !== 'font') return;
        pending.push(response.body().then((body) => {
            if (type === 'font') {
                sizes.fonts += body.length;
                return;
            }
            sizes.images += body.length;
            if (body.length > sizes.maxImage) {
                sizes.maxImage = body.length;
                sizes.maxImageUrl = response.url();
            }
        }, () => undefined));
    });
    await page.goto(path, { waitUntil: 'networkidle' });
    await Promise.all(pending);
    return sizes;
};

test.describe('Новый фронт: медленный интернет', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    for (const budget of BUDGETS) {
        test(`бюджет ${budget.path}: картинки и шрифты`, async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
            const sizes = await measure(page, budget.path);
            const kb = (n: number) => `${Math.round(n / KB)} КБ`;
            expect(sizes.images, `картинки ${budget.path}: ${kb(sizes.images)}`).toBeLessThanOrEqual(budget.images);
            expect(sizes.maxImage, `самая тяжёлая картинка ${kb(sizes.maxImage)}: ${sizes.maxImageUrl}`).toBeLessThanOrEqual(budget.maxImage);
            expect(sizes.fonts, `шрифты ${kb(sizes.fonts)}`).toBeLessThanOrEqual(FONTS_BUDGET);
        });
    }

    test('медленная сеть: на первом экране картинки не пустые и не прыгают', async ({ page, context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
        test.setTimeout(120_000);
        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 50 * KB, uploadThroughput: 20 * KB });

        for (const path of ['/blog', '/offers-map']) {
            await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 90_000 });
            await expect(page.locator('main').first()).toBeVisible({ timeout: 60_000 });
            const problems = await page.evaluate(() => [...document.images]
                .filter((img) => /storage\.yandexcloud\.net|\/web\/images\//.test(img.src))
                .filter((img) => {
                    const box = img.getBoundingClientRect();
                    return box.top < window.innerHeight && box.bottom > 0 && box.width > 0;
                })
                .flatMap((img) => {
                    const box = img.getBoundingClientRect();
                    const issues: string[] = [];
                    if (img.loading === 'lazy' && box.height < 2) issues.push(`высота 0 у ленивой: ${img.src}`);
                    const shimmer = getComputedStyle(img).backgroundImage.includes('gradient');
                    if (!img.hasAttribute('data-loaded') && !img.hasAttribute('data-fallback') && !shimmer) issues.push(`нет заглушки: ${img.src}`);
                    return issues;
                }));
            expect(problems, path).toEqual([]);
        }
    });
});

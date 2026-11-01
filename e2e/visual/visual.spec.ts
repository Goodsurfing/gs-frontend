import { test, expect } from '@playwright/test';
import { loadDataPages, STATIC_PAGES } from '../support/publicPages';

/**
 * Визуальные эталоны публичных страниц (GS-214) — критерий приёмки нового
 * фронта GS-212: внешне он должен совпадать со старым.
 *
 * Данные стейджа каждую ночь заменяются копией прода, поэтому эталоны не
 * хранятся в репозитории навсегда: их снимают со старого фронта прямо перед
 * сравнением, на тех же данных. Порядок — в e2e/README.md.
 *
 * Запуск: E2E_VISUAL=1 npx playwright test --project=visual
 */
const VIEWPORTS = [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
];
const LOCALES = ['ru', 'en'];

// Меняется само по себе (карты, видео, слайдеры с автопрокруткой) — маскируем.
// Отзывы на главной приходят в разном порядке.
const DYNAMIC = [
    'ymaps', '[class*="ymaps"]', 'iframe', 'video', '.swiper-wrapper',
    '[data-testid="reviews-slider"]',
];

// Анимации появления при прокрутке (AOS) — показываем элементы сразу.
const FREEZE_CSS = `
    [data-aos] { opacity: 1 !important; transform: none !important; transition: none !important; }
    *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; }
`;

test.describe.configure({ mode: 'parallel' });

for (const viewport of VIEWPORTS) {
    for (const locale of LOCALES) {
        test(`эталоны ${viewport.name} ${locale}`, async ({ page }) => {
            test.setTimeout(10 * 60_000);
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            const pages = [...STATIC_PAGES, ...(await loadDataPages())];

            for (const { name, path } of pages) {
                await page.goto(`/${locale}${path}`, { waitUntil: 'domcontentloaded' });
                await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);
                // Ленивые картинки: прокрутить до конца и обратно
                await page.evaluate(async () => {
                    for (let y = 0; y < document.body.scrollHeight; y += 600) {
                        window.scrollTo(0, y);
                        await new Promise((r) => setTimeout(r, 50));
                    }
                    window.scrollTo(0, 0);
                });
                await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
                await page.addStyleTag({ content: FREEZE_CSS });
                // Дождаться картинок и шрифтов: иначе блок, догрузившийся позже,
                // сдвигает всю страницу и снимок «плавает» между прогонами
                await page.evaluate(async () => {
                    await document.fonts.ready;
                    await Promise.all([...document.images]
                        .filter((img) => !img.complete)
                        .map((img) => new Promise((resolve) => {
                            img.addEventListener('load', resolve, { once: true });
                            img.addEventListener('error', resolve, { once: true });
                        })));
                });

                await expect.soft(page).toHaveScreenshot(`${name}-${viewport.name}-${locale}.png`, {
                    fullPage: true,
                    animations: 'disabled',
                    caret: 'hide',
                    mask: DYNAMIC.map((selector) => page.locator(selector)),
                    maxDiffPixelRatio: 0.02,
                    timeout: 30_000,
                });
            }
        });
    }
}

import { test, expect, type Page } from '@playwright/test';
import { BASE_URL } from '../config';

/**
 * Предложение членства на телефоне (клуб тестеров, 27.11.2026): на iPhone окно открывалось
 * под открытым меню, прокрутка уже была заблокирована — страница «висела». Теперь окно ждёт,
 * пока меню закроют, видно сразу, а после закрытия прокрутка возвращается. Шапка при открытом
 * меню непрозрачная — пункты не просвечивают под логотипом.
 *
 * Окно показывается через 2 минуты от начала визита и не показывается автоматическим браузерам —
 * в тесте начало визита сдвинуто назад, а navigator.webdriver скрыт.
 */
const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const MENU = 'Меню';

const dueNudge = (page: Page, inMs: number) => page.evaluate((ms) => {
    sessionStorage.removeItem('membershipTimedPopupShown');
    sessionStorage.setItem('membershipNudgeStartedAt', String(Date.now() - 120_000 + ms));
}, inMs);

test.describe('Новый фронт: предложение членства и меню на телефоне', () => {
    test('окно не открывается под меню, появляется после закрытия меню и возвращает прокрутку', async ({ browser }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'волонтёр без членства; один прогон');
        const context = await browser.newContext({
            userAgent: IPHONE_SAFARI,
            viewport: { width: 390, height: 844 },
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            storageState: testInfo.project.use.storageState as string,
        });
        await context.addCookies([{ name: 'gs_web', value: '1', url: BASE_URL }]);
        await context.addInitScript(() => {
            Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false, configurable: true });
        });
        const page = await context.newPage();
        await page.goto('/');
        await dueNudge(page, 2_000);
        await page.reload();

        // Меню открыто и прокручено вниз — как на видео тестера
        const menuButton = page.getByRole('button', { name: MENU, exact: true });
        await menuButton.click();
        await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
        const nav = page.getByRole('navigation', { name: MENU, exact: true }).filter({ hasText: 'Выход' });
        await nav.evaluate((el) => el.scrollTo(0, el.scrollHeight));

        // Шапка над меню и непрозрачная: в точке логотипа сверху — сама шапка, а не пункт меню
        const headerOnTop = await page.evaluate(() => {
            const logo = document.querySelector('img[src*="logo-mobile"]')!.getBoundingClientRect();
            const hit = document.elementFromPoint(logo.right + 4, logo.top + logo.height / 2);
            const header = hit?.closest('header');
            return !!header && getComputedStyle(header).backgroundColor === 'rgb(255, 255, 255)';
        });
        expect(headerOnTop).toBe(true);

        // Срок наступил, но меню открыто — окна нет, меню листается
        await page.waitForTimeout(5_000);
        await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(page.locator('body')).not.toHaveAttribute('style', /pointer-events:\s*none/);

        await menuButton.click();
        const dialog = page.getByTestId('membership-nudge');
        await expect(dialog).toBeVisible({ timeout: 8_000 });
        await expect(dialog.getByRole('link', { name: 'Получить членство' })).toBeVisible();
        // Карточка непрозрачная, сверху именно она (не перекрыта ни меню, ни затемнением)
        const onTop = await dialog.evaluate((el) => {
            const r = el.getBoundingClientRect();
            const hit = document.elementFromPoint(r.left + r.width / 2, r.bottom - 30);
            return el.contains(hit) && getComputedStyle(el).backgroundColor === 'rgb(255, 255, 255)';
        });
        expect(onTop).toBe(true);

        await dialog.getByRole('button', { name: 'Закрыть' }).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(page.locator('body')).not.toHaveAttribute('style', /pointer-events:\s*none|overflow:\s*hidden/);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
        await page.evaluate(() => window.scrollTo(0, 400));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
        await context.close();
    });
});

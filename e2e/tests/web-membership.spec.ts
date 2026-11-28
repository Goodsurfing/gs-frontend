import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: страница «Членство». Оплата тарифа — отдельная страница /payment. */
test.describe('Новый фронт: членство', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('тарифы с ценами и ссылками на оплату, регистрация, вопросы раскрываются', async ({ page }) => {
            const response = await page.goto('/membership');
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            // На компьютере — прежняя шапка; компактный первый экран телефона (GS-333) скрыт
            await expect(page.getByRole('heading', { level: 1, name: /Стань частью сообщества Гудсёрфинга/ })).toBeVisible();
            await expect(page.locator('#membership-compact')).toBeHidden();
            await expect(page.getByRole('link', { name: /^Оформить за [\d\s]+ ₽$/ })).toHaveAttribute('href', '/payment?tariff=volunteer_990');

            const volunteer = page.locator('#tariffs');
            await expect(volunteer).toBeVisible();
            await expect(volunteer.getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
            await expect(volunteer.getByRole('link', { name: 'Присоединиться' })).toHaveAttribute('href', '/signup');
            await expect(volunteer).toContainText(/\d[\d\s]* руб\/год/);
            await expect(page.locator('#host').getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=host_4990');
            await expect(page.locator('#international').getByRole('link', { name: /Стать участником/ })).toHaveAttribute('href', '/payment?tariff=international_5000');
            // Кнопки «Подробнее» только на телефоне
            await expect(page.getByRole('button', { name: 'Что входит в членство' })).toBeHidden();

            const question = page.getByRole('button', { name: 'Куда идут мои деньги?' });
            await question.click();
            await expect(question).toHaveAttribute('aria-expanded', 'true');
        });

        test('телефон: первый экран с ценой и «Оформить», остальное под «Подробнее», полоса после первого экрана', async ({ page }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto('/membership');

            // Первый экран (GS-333): цена за год, «на двоих», выгоды, «Оформить» сразу к оплате
            const hero = page.locator('#membership-compact');
            await expect(hero.getByRole('heading', { level: 1, name: 'Членство Гудсёрфинга' })).toBeVisible();
            await expect(page.getByRole('heading', { level: 1, name: /Стань частью сообщества/ })).toBeHidden();
            await expect(hero).toContainText(/\d[\d\s]* ₽\s*в год/);
            await expect(hero.getByRole('link', { name: /^На двоих — [\d\s]+ ₽ в год$/ })).toHaveAttribute('href', '/payment?tariff=volunteer_duo');
            await expect(hero.getByRole('listitem')).toHaveCount(3);
            await expect(hero.getByRole('link', { name: 'Оформить', exact: true })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
            await expect(hero.getByText('Членство включается сразу после оплаты', { exact: false })).toBeVisible();
            await expect(hero.getByRole('link', { name: /^Подробнее/ })).toHaveAttribute('href', '#membership-details');

            // Тарифы свёрнуты в «Что входит в членство»; раскрыл — платная карточка первой, ссылки на оплату и регистрацию
            const tariffs = page.locator('#tariffs');
            await expect(tariffs).toBeHidden();
            const details = page.getByRole('button', { name: 'Что входит в членство' });
            await expect(details).toHaveAttribute('aria-expanded', 'false');
            await details.click();
            await expect(details).toHaveAttribute('aria-expanded', 'true');
            await expect(tariffs).toBeVisible();
            const paidY = (await tariffs.getByRole('heading', { name: 'Членство', exact: true }).boundingBox())?.y ?? 0;
            const freeY = (await tariffs.getByRole('heading', { name: 'Без членства' }).boundingBox())?.y ?? 0;
            expect(paidY).toBeGreaterThan(0);
            expect(paidY).toBeLessThan(freeY);
            await expect(tariffs.getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
            await expect(tariffs.getByRole('link', { name: 'Присоединиться' })).toHaveAttribute('href', '/signup');

            // Полоса «Членство на год — N ₽ · Оформить» появляется, когда первый экран уехал вверх
            const bar = page.getByText(/^Членство на год — [\d\s]+ ₽$/).locator('..').getByRole('link', { name: 'Оформить', exact: true });
            await page.evaluate(() => window.scrollTo(0, (document.getElementById('membership-compact')?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 50));
            await expect(bar).toBeInViewport();
            await expect(bar).toHaveAttribute('href', '/payment?tariff=volunteer_990');
        });

        test('телефон: ссылка на блок внутри «Подробнее» раскрывает его', async ({ page }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto('/membership#host');
            await expect(page.getByRole('button', { name: 'Членство для организаторов' })).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#host').getByRole('link', { name: 'Получить членство' })).toBeVisible();
            await expect(page.locator('#host').getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=host_4990');
        });
    });

    test('телефон: членство уже есть — первым крупно «активно до», без цены', async ({ page }) => {
        // Ответ API подменён: на стейдже ничего не покупается
        await page.route('**/api/v1/membership/current-all', (route) => route.fulfill({
            json: [{ isActive: true, endDate: '2027-11-27T12:00:00+03:00', tariff: { code: 'volunteer_990', category: 'REGULAR' } }],
        }));
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/membership');
        const hero = page.locator('#membership-compact');
        await expect(hero.getByRole('status')).toHaveText('Членство активно до 27.11.2027');
        await expect(hero).not.toContainText(/\d[\d\s]* ₽\s*в год/);
        await expect(hero.getByRole('link', { name: 'Оформить', exact: true })).toHaveCount(0);
    });

    test('волонтёр: без кнопок регистрации', async ({ page }) => {
        await page.goto('/membership');
        await expect(page.locator('#tariffs').getByRole('link', { name: 'Получить членство' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Присоединиться' })).toHaveCount(0);
    });
});

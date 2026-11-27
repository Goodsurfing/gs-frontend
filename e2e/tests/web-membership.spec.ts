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
            // На компьютере видна прежняя шапка; первый экран телефона (GS-333) в разметке, но скрыт
            await expect(page.getByRole('heading', { level: 1, name: /^Стань частью сообщества Гудсёрфинга/ })).toBeVisible();
            await expect(page.locator('#membership-compact')).toBeHidden();

            const volunteer = page.locator('#tariffs');
            await expect(volunteer.getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
            await expect(volunteer.getByRole('link', { name: 'Присоединиться' })).toHaveAttribute('href', '/signup');
            await expect(volunteer).toContainText(/\d[\d\s]* руб\/год/);
            await expect(page.locator('#host').getByRole('link', { name: 'Получить членство' })).toHaveAttribute('href', '/payment?tariff=host_4990');
            await expect(page.locator('#international').getByRole('link', { name: /Стать участником/ })).toHaveAttribute('href', '/payment?tariff=international_5000');

            const question = page.getByRole('button', { name: 'Куда идут мои деньги?' });
            await question.click();
            await expect(question).toHaveAttribute('aria-expanded', 'true');
        });

        test('телефон: первый экран с ценой и «Оформить», тарифы в «Подробнее», полоса после первого экрана (GS-333)', async ({ page }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto('/membership');
            const hero = page.locator('#membership-compact');
            await expect(hero.getByRole('heading', { level: 1, name: 'Членство Гудсёрфинга' })).toBeVisible();
            await expect(hero).toContainText(/\d[\d\s]* ₽\s*в год/);
            await expect(hero.getByRole('link', { name: 'Оформить', exact: true })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
            await expect(hero.getByText('Членство включается сразу после оплаты', { exact: false })).toBeVisible();

            // Тарифы свёрнуты в «Подробнее»; раскрытые — платная карточка первой
            const tariffs = page.locator('#tariffs');
            await expect(tariffs).toBeHidden();
            const details = page.getByRole('button', { name: 'Что входит в членство' });
            await details.click();
            await expect(details).toHaveAttribute('aria-expanded', 'true');
            const paidY = (await tariffs.getByRole('heading', { name: 'Членство', exact: true }).boundingBox())?.y ?? 0;
            const freeY = (await tariffs.getByRole('heading', { name: 'Без членства' }).boundingBox())?.y ?? 0;
            expect(paidY).toBeLessThan(freeY);

            // Полоса «Членство на год — … · Оформить» — когда первый экран уехал вверх (до этого скрыта от чтения)
            await page.evaluate(() => window.scrollTo(0, (document.getElementById('membership-compact')?.getBoundingClientRect().bottom ?? 0) + window.scrollY + 50));
            const bar = page.getByRole('link', { name: 'Оформить', exact: true }).last();
            await expect(bar).toBeInViewport();
            await expect(bar).toHaveAttribute('href', '/payment?tariff=volunteer_990');
        });
    });

    test('волонтёр: без кнопок регистрации', async ({ page }) => {
        await page.goto('/membership');
        await expect(page.locator('#tariffs').getByRole('link', { name: 'Получить членство' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Присоединиться' })).toHaveCount(0);
    });
});

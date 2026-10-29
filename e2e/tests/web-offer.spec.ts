import { test, expect, request, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/** Популярная открытая вакансия, у которой больше одной страницы отзывов. */
const findOffer = async (): Promise<number | undefined> => {
    const api = await request.newContext();
    const res = await api.get(`${API_URL}/api/v1/vacancy?page=1&limit=50&sort=popularity:desc&fields=card`);
    const offers: { id: number; status: string; reviewsCount: number }[] = (await res.json())?.data ?? [];
    return offers.find((offer) => offer.status === 'active' && offer.reviewsCount > 5)?.id;
};

const participate = (page: Page) => page.getByRole('main').getByRole('link', { name: /Участвовать|Вы отправили заявку|Вы участвуете|станьте гудсёрфером/ }).first();

/** Новый фронт: страница вакансии (OfferPersonalPage старого фронта). */
test.describe('Новый фронт: страница вакансии', () => {
    test.beforeEach(async ({ context }) => {
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('карточка, разделы, отзывы по страницам, «Участвовать» ведёт на вход', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
            const id = await findOffer();
            test.skip(!id, 'нет вакансии с отзывами');
            await page.setViewportSize({ width: 1280, height: 900 });
            const response = await page.goto(`/offers/${id}`);
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();

            const api = await request.newContext();
            const offer = await (await api.get(`${API_URL}/api/v1/vacancy/${id}`)).json();
            await expect(page.getByRole('heading', { level: 1 })).toContainText(offer.description.title.slice(0, 30));
            for (const section of ['#description', '#organization', '#participants', '#review']) {
                await expect(page.locator(section)).toBeAttached();
            }
            await expect(participate(page)).toHaveAttribute('href', `/signin?next=offer&nextId=${id}`);

            // Отзывы: первые пять с сервера, «Посмотреть следующие» догружает
            const reviews = page.locator('#review > div').last().locator('> div');
            await expect(reviews).toHaveCount(5);
            await page.locator('#review').getByRole('button', { name: 'Посмотреть следующие' }).click();
            await expect.poll(() => reviews.count()).toBeGreaterThan(5);

            // Меню разделов: «Организация» прокручивает к блоку
            await page.getByRole('navigation').getByRole('button', { name: 'Организация' }).click();
            await expect(page.locator('#organization')).toBeInViewport();
        });

        test('несуществующая вакансия — сообщение и «Назад»', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            await page.goto('/offers/999999999');
            await expect(page.getByText('Вакансия не найдена или произошла ошибка')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Назад' })).toBeVisible();
            await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', /noindex/);
        });
    });

    test('волонтёр: «Участвовать» ведёт к отклику, а не на вход', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'только волонтёр');
        const id = await findOffer();
        test.skip(!id, 'нет вакансии с отзывами');
        await page.goto(`/offers/${id}`);
        // Персональное состояние приходит из браузера после входа
        await expect.poll(async () => (await participate(page).getAttribute('href')) ?? '', { timeout: 15_000 })
            .toBe(`/messenger/create/${id}`);
    });
});

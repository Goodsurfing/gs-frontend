import { test, expect, request, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';
import { expectNoindex } from '../support/pageCheck';

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

        test('телефон: при прокрутке «Участвовать» видна всегда — в обложке или полосой внизу', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            const id = await findOffer();
            test.skip(!id, 'нет открытой вакансии');
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto(`/offers/${id}`);
            await expect(page.locator('[data-offer-hero-actions]')).toBeAttached();
            // Видимая кнопка «Участвовать» (обложка или полоса внизу) в точках прокрутки до конца описания
            const visibleCta = () => page.evaluate(() => [...document.querySelectorAll('a,span')]
                .filter((el) => /^(Участвовать|.*гудсёрфером)$/.test((el.textContent ?? '').trim()))
                .some((el) => {
                    const r = el.getBoundingClientRect();
                    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
                }));
            for (let y = 0; y <= 1600; y += 80) {
                await page.evaluate((top) => window.scrollTo(0, top), y);
                await expect.poll(visibleCta, { message: `прокрутка ${y}px` }).toBe(true);
            }
        });

        test('несуществующая вакансия — сообщение и «Назад»', async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            const response = await page.goto('/offers/999999999');
            // GS-302: настоящий 404 для поисковиков, сообщение и каркас — как были
            expect(response?.status()).toBe(404);
            await expect(page.getByText('Вакансия не найдена или произошла ошибка')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Назад' })).toBeVisible();
            // Тегов robots после перерисовки ISR бывает два одинаковых (Next 16.4.6, PR #973) — проверяем все
            await expectNoindex(page);
        });
    });

    test('волонтёр: приём заявок закончился — кнопка сразу неактивна с причиной, без «мигания» (27.11)', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'нужен волонтёр');
        // Фикстура «E2E Тестовая вакансия 5» — приём заявок нарочно закончился (applicationEndDate в прошлом)
        const api = await request.newContext();
        const found = await (await api.get(`${API_URL}/api/v1/vacancy?search=${encodeURIComponent('E2E Тестовая вакансия 5')}&limit=5&fields=card`)).json();
        const offer = (found?.data ?? []).find((item: { title?: string }) => item.title?.startsWith('E2E Тестовая вакансия 5'));
        test.skip(!offer, 'нет фикстуры «E2E Тестовая вакансия 5»');
        const when = (await (await api.get(`${API_URL}/api/v1/vacancy/${offer.id}`)).json())?.when;
        await api.dispose();
        test.skip(!when?.applicationEndDate, 'у фикстуры нет даты окончания приёма');

        // Уже в HTML с сервера, до входа и скриптов: неактивная кнопка с причиной
        const html = await (await page.request.get(`/offers/${offer.id}`, { headers: { Cookie: '' } })).text();
        expect(html).toContain('Приём заявок завершён');

        await page.goto(`/offers/${offer.id}`);
        const button = page.getByRole('main').getByText('Приём заявок завершён').first();
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute('aria-disabled', 'true');
        await expect(page.getByRole('main').getByRole('link', { name: 'Участвовать' })).toHaveCount(0);
        // Ответ API для вошедшего пришёл — кнопка всё та же
        await page.waitForTimeout(2000);
        await expect(button).toHaveAttribute('aria-disabled', 'true');
        await expect(page.getByRole('main').getByRole('link', { name: 'Участвовать' })).toHaveCount(0);
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

    test('волонтёр: кончились бесплатные отклики — предложение членства с ценой', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'только волонтёр');
        const id = await findOffer();
        test.skip(!id, 'нет вакансии с отзывами');
        // Ответ вакансии от имени волонтёра подменяется: лимит исчерпан
        await page.route(`**/api/v1/vacancy/${id}`, async (route) => {
            if (route.request().method() !== 'GET') return route.fallback();
            const response = await route.fetch();
            const json = await response.json();
            return route.fulfill({ response, json: { ...json, canParticipate: false, requiresMembershipToParticipate: true } });
        });
        await page.goto(`/offers/${id}`);
        const upsell = page.getByRole('note', { name: 'Бесплатные отклики на этот год закончились' }).first();
        await expect(upsell).toBeVisible({ timeout: 15_000 });
        await expect(upsell).toContainText(/Членство — \d[\d\s]* ₽ на год: отклики без ограничений/);
        // С 11.11.2026 (GS-289) — сразу к оплате членства волонтёра, а не на общую страницу членства
        await expect(upsell.getByRole('link', { name: 'Оформить членство' })).toHaveAttribute('href', '/payment?tariff=volunteer_990');
    });
});

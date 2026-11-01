import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

const offer = (id: number, title: string) => ({
    id, title, shortDescription: 'E2E: описание', image: null, categories: [], address: 'Москва',
    acceptedApplicationsCount: 1, averageRating: 0, reviewsCount: 0, status: 'active', latitude: 55, longitude: 37,
});
const FAVORITES = { data: [offer(601, 'E2E: избранная 1'), offer(602, 'E2E: избранная 2')], pagination: { total: 2, page: 1, limit: 100 } };
const FUNDRAISES = {
    data: [{
        id: 'e2e-fund', name: 'E2E: сбор', shortDescription: 'E2E: описание сбора', image: null, organization: { id: 'o', name: 'E2E: организация' },
        percentAmountCollect: 40, daysLeft: 5, isSuccess: false, isClose: false, isCanEdit: false, isCanSupport: true, collectedAmount: 400,
    }],
    pagination: { total: 1, page: 1, limit: 10 },
};

/** Новый фронт: кабинет волонтёра — подписки, поддержать, избранное. */
test.describe('Новый фронт: подписки, поддержать, избранное', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка кабинета волонтёра');
        await enableNewFrontend(context);
    });

    test('подписки: заголовок, меню кабинета', async ({ page }) => {
        const response = await page.goto('/volunteer/subscribers');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { name: 'Подписки' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Панель управления' }).first()).toBeVisible();
    });

    test('поддержать: сборы со ссылками на сбор и на оплату', async ({ page }) => {
        await page.route(/\/api\/v1\/fundraise\?/, (route) => route.fulfill({ json: FUNDRAISES }));
        const response = await page.goto('/volunteer/donations');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Поддержать другие проекты' })).toBeVisible();
        await expect(page.getByRole('link', { name: /E2E: сбор/ })).toHaveAttribute('href', '/fundraise/e2e-fund');
        await expect(page.getByRole('link', { name: 'Поддержать', exact: true }).last()).toHaveAttribute('href', '/donation/pay/e2e-fund');
        await expect(page.getByText('Собрано 40 %')).toBeVisible();
    });

    test('поддержать: без сборов — «проектов нет»', async ({ page }) => {
        await page.route(/\/api\/v1\/fundraise\?/, (route) => route.fulfill({ json: { data: [], pagination: { total: 0 } } }));
        await page.goto('/volunteer/donations');
        await expect(page.getByText('На данный момент проектов нет')).toBeVisible();
    });

    test('избранное: карточки с сердечком, снятая пропадает', async ({ page }) => {
        await page.route(/\/api\/v1\/favorites\/vacancies\/ids/, (route) => route.fulfill({ json: { ids: [601, 602] } }));
        await page.route(/\/api\/v1\/favorites\/vacancies\?/, (route) => route.fulfill({ json: FAVORITES }));
        let removed: string | null = null;
        // Настоящее избранное не трогаем: запрос перехватывается
        await page.route(/\/api\/v1\/favorites\/vacancies\/60\d$/, (route) => {
            removed = `${route.request().method()} ${new URL(route.request().url()).pathname}`;
            return route.fulfill({ json: {} });
        });
        const response = await page.goto('/favorite-offers');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Избранные вакансии' })).toBeVisible();
        await expect(page.getByText('E2E: избранная 1')).toBeVisible();
        const hearts = page.getByRole('button', { name: 'Убрать из избранного' });
        await expect(hearts).toHaveCount(2);
        await expect(hearts.first()).toHaveAttribute('aria-pressed', 'true');
        await hearts.first().click();
        await expect(page.getByText('E2E: избранная 1')).toHaveCount(0);
        await expect(page.getByText('E2E: избранная 2')).toBeVisible();
        expect(removed).toBe('DELETE /api/v1/favorites/vacancies/601');
    });

    test('избранное: пусто — приглашение на карту вакансий', async ({ page }) => {
        await page.route(/\/api\/v1\/favorites\/vacancies\?/, (route) => route.fulfill({ json: { data: [], pagination: { total: 0 } } }));
        await page.goto('/favorite-offers');
        await expect(page.getByText('Вы пока не добавили ни одну вакансию в избранное, давайте это исправим?')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Посмотреть вакансии' })).toHaveAttribute('href', '/offers-map');
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('подписки, поддержать и избранное уводят на вход', async ({ page }) => {
            for (const path of ['/volunteer/subscribers', '/volunteer/donations', '/favorite-offers']) {
                await page.goto(path);
                // Гостя уводит после ответа API о профиле (в SessionProvider — до 10 с)
                await expect(page).toHaveURL(/\/signin/, { timeout: 15_000 });
            }
        });
    });
});

import { test, expect, request, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Новый фронт: сообщения. Список чатов и переписка — на настоящих данных
 * стейджа; отправка сообщения и заявки перехватываются (на стейдже ничего
 * не создаётся).
 */
const isNewFrontend = async (page: Page) => {
    await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
};

test.describe('Новый фронт: сообщения', () => {
    test.beforeEach(async ({ context }) => {
        await enableNewFrontend(context);
    });

    test('организатор: список чатов, переписка, отправка (перехвачена)', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'у host@test.com есть переписка с волонтёрами');
        const response = await page.goto('/messenger');
        expect(response?.status()).toBe(200);
        await isNewFrontend(page);
        await expect(page.getByRole('heading', { name: 'Сообщения' })).toBeVisible();
        await expect(page.getByText('Выберите, кому хотели бы написать')).toBeVisible();
        const chats = page.locator('a[href^="/messenger/"]');
        await expect(chats.first()).toBeVisible({ timeout: 15_000 });

        await chats.first().click();
        await expect(page).toHaveURL(/\/messenger\/\d+$/);
        const input = page.getByLabel('Написать сообщение');
        await expect(input).toBeVisible();

        // Отправка — без записи на стейдже: ответ подменяется
        const chatId = page.url().split('/').pop();
        let sent: unknown = null;
        await page.route('**/api/v1/messages', async (route) => {
            if (route.request().method() !== 'POST') return route.continue();
            sent = route.request().postDataJSON();
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ id: 999999999, text: 'Проверка отправки', author: '/api/v1/users/me', createdAt: new Date().toISOString(), chat: `/api/v1/chats/${chatId}`, attachments: [] }),
            });
        });
        await page.route('**/api/v1/personal/chats**', (route) => route.continue());
        await expect(page.getByRole('button', { name: 'Написать сообщение' })).toBeDisabled();
        await input.fill('Проверка отправки');
        await input.press('Enter');
        await expect.poll(() => sent).toMatchObject({ chat: `/api/v1/chats/${chatId}`, text: 'Проверка отправки' });
        await expect(page.getByText('Проверка отправки')).toBeVisible();
        await expect(input).toHaveValue('');
    });

    test('телефон: список и переписка по отдельности, «Назад» к списку', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'нужна переписка');
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/messenger');
        await isNewFrontend(page);
        const chats = page.locator('a[href^="/messenger/"]');
        await expect(chats.first()).toBeVisible({ timeout: 15_000 });
        await chats.first().click();
        await expect(page.getByLabel('Написать сообщение')).toBeVisible();
        await expect(chats.first()).toBeHidden();
        await page.getByRole('button', { name: 'Назад' }).click();
        await expect(page).toHaveURL(/\/messenger$/);
        await expect(chats.first()).toBeVisible();
    });

    test('волонтёр: отклик на вакансию — даты и заявка (перехвачена)', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'отклик — у волонтёра');
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        try {
            // Первая открытая вакансия каталога
            const catalog = await (await api.get('/api/v1/vacancy?limit=1&fields=card', { headers: { Accept: 'application/json' } })).json();
            const offerId = (Array.isArray(catalog) ? catalog : catalog.data ?? catalog['hydra:member'] ?? [])[0]?.id;
            test.skip(!offerId, 'нет активной вакансии на стейдже');

            let applied: unknown = null;
            await page.route('**/api/v1/applications', async (route) => {
                if (route.request().method() !== 'POST') return route.continue();
                applied = route.request().postDataJSON();
                await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ detail: 'Проверочный ответ: заявка не создана' }) });
            });
            await page.goto(`/messenger/create/${offerId}`);
            await isNewFrontend(page);
            await expect(page.getByText('Прибытие')).toBeVisible({ timeout: 15_000 });
            await expect(page.getByText('Отъезд')).toBeVisible();
            // Поле сообщения на отклике закрыто — сначала заявка
            await expect(page.getByLabel('Написать сообщение')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Написать сообщение' })).toBeDisabled();

            const submit = page.getByRole('button', { name: 'Заявка' });
            if (await submit.isDisabled()) {
                // Даты не подставлены (у вакансии не один период) — выбрать в календаре
                // Даты — в следующем месяце: прошлые дни в календаре закрыты
                await page.getByLabel('Прибытие').click();
                await page.getByRole('button', { name: '›', exact: true }).click();
                await page.getByRole('button', { name: '10', exact: true }).click();
                await page.getByLabel('Отъезд').click();
                await page.getByRole('button', { name: '›', exact: true }).click();
                await page.getByRole('button', { name: '20', exact: true }).click();
            }
            await expect(submit).toBeEnabled();
            await submit.click();
            await expect.poll(() => applied).toMatchObject({ vacancy: `/api/v1/vacancies/${offerId}` });
            await expect(page.getByText('Проверочный ответ: заявка не создана')).toBeVisible();
        } finally {
            await api.dispose();
        }
    });

    test('гостя уводит на вход', async ({ browser }) => {
        const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
        await enableNewFrontend(context);
        const page = await context.newPage();
        await page.goto('/messenger');
        await expect(page).toHaveURL(/\/signin/);
        await context.close();
    });
});

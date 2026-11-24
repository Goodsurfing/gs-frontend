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
        // Вкладки как во входящих: «Все» выбрана, «Принятые» оставляет только принятые заявки
        await expect(page.getByRole('tab', { name: 'Все' })).toHaveAttribute('aria-selected', 'true');
        await page.getByRole('tab', { name: 'Принятые' }).click();
        await expect(page.getByRole('tab', { name: 'Принятые' })).toHaveAttribute('aria-selected', 'true');
        await page.getByRole('tab', { name: 'Все' }).click();

        await chats.first().click();
        await expect(page).toHaveURL(/\/messenger\/\d+$/);
        const input = page.getByRole('textbox', { name: 'Написать сообщение' });
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
        await expect(page.getByRole('button', { name: 'Отправить' })).toBeDisabled();
        await input.fill('Проверка отправки');
        // Кнопка оживает после перерисовки с текстом — тогда Enter отправит
        await expect(page.getByRole('button', { name: 'Отправить' })).toBeEnabled();
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
        await expect(page.getByRole('textbox', { name: 'Написать сообщение' })).toBeVisible();
        await expect(chats.first()).toBeHidden();
        await page.getByRole('button', { name: 'Назад' }).click();
        await expect(page).toHaveURL(/\/messenger$/);
        await expect(chats.first()).toBeVisible();
    });

    /** Первая открытая вакансия каталога стейджа */
    const firstOfferId = async () => {
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        try {
            const catalog = await (await api.get('/api/v1/vacancy?limit=1&fields=card', { headers: { Accept: 'application/json' } })).json();
            return (Array.isArray(catalog) ? catalog : catalog.data ?? catalog['hydra:member'] ?? [])[0]?.id as number | undefined;
        } finally {
            await api.dispose();
        }
    };

    /** Даты d.m.Y через n дней — как отдаёт бэкенд */
    const apiDay = (days: number) => {
        const day = new Date();
        day.setDate(day.getDate() + days);
        return `${String(day.getDate()).padStart(2, '0')}.${String(day.getMonth() + 1).padStart(2, '0')}.${day.getFullYear()}`;
    };
    const isoDay = (days: number) => apiDay(days).split('.').reverse().join('-');

    /** Подменить «Когда» у вакансии: настоящая вакансия, но периоды — свои */
    const withWhen = async (page: Page, offerId: number, when: Record<string, unknown>) => {
        await page.route(`**/api/v1/vacancies/${offerId}`, async (route) => {
            if (route.request().method() !== 'GET') return route.continue();
            const response = await route.fetch();
            const body = await response.json();
            await route.fulfill({ response, json: { ...body, when: { ...(body.when ?? {}), ...when } } });
        });
    };

    test('волонтёр: отклик на телефоне — период организатора, «Пару слов о себе», большая кнопка (заявка перехвачена)', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'отклик — у волонтёра');
        const offerId = await firstOfferId();
        test.skip(!offerId, 'нет активной вакансии на стейдже');
        await page.setViewportSize({ width: 390, height: 844 });
        // Два будущих периода и один прошедший — прошедший не показывается
        await withWhen(page, offerId!, {
            isFullYearAcceptable: false,
            durationMinDays: null,
            durationMaxDays: null,
            periods: [
                { start: apiDay(-30), ending: apiDay(-10) },
                { start: apiDay(20), ending: apiDay(30) },
                { start: apiDay(40), ending: apiDay(50) },
            ],
        });
        let applied: Record<string, unknown> | null = null;
        await page.route('**/api/v1/applications', async (route) => {
            if (route.request().method() !== 'POST') return route.continue();
            applied = route.request().postDataJSON();
            await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ detail: 'Проверочный ответ: заявка не создана' }) });
        });
        await page.goto(`/messenger/create/${offerId}`);
        await isNewFrontend(page);

        const form = page.getByRole('form', { name: 'Отклик на вакансию' });
        await expect(form).toBeVisible({ timeout: 15_000 });
        // Поле переписки на отклике не показывается — вместо него «Пару слов о себе»
        await expect(page.getByRole('textbox', { name: 'Написать сообщение' })).toHaveCount(0);
        const periods = form.getByRole('radio');
        await expect(periods).toHaveCount(2);
        await expect(periods.first()).not.toBeChecked();

        // Большая кнопка с подписью, видна без прокрутки (прилипает к низу экрана)
        const submit = form.getByRole('button', { name: 'Отправить отклик' });
        await expect(submit).toBeInViewport();
        const box = await submit.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(48);
        expect(box!.width).toBeGreaterThan(300);

        // Без выбранного периода кнопка неактивна (aria-disabled), нажатие — подсказка, запрос не уходит
        await expect(submit).toHaveAttribute('aria-disabled', 'true');
        await submit.click({ force: true });
        await expect(form.getByText('Выберите даты, чтобы отправить отклик')).toBeVisible();
        expect(applied).toBeNull();

        await periods.nth(1).check();
        await form.getByRole('textbox', { name: /Пару слов о себе/ }).fill('Работал на ферме, умею с лошадьми');
        await submit.click();
        await expect.poll(() => applied).toMatchObject({
            vacancy: `/api/v1/vacancies/${offerId}`,
            startDate: isoDay(40),
            endDate: isoDay(50),
            message: 'Работал на ферме, умею с лошадьми',
        });
        // Ошибка — рядом с кнопкой, введённое не пропало
        await expect(form.getByText('Проверочный ответ: заявка не создана')).toBeVisible();
        await expect(form.getByRole('textbox', { name: /Пару слов о себе/ })).toHaveValue('Работал на ферме, умею с лошадьми');
    });

    test('волонтёр: отклик без периодов — даты подсказаны, текст необязателен, обрыв сети не теряет введённое', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'отклик — у волонтёра');
        const offerId = await firstOfferId();
        test.skip(!offerId, 'нет активной вакансии на стейдже');
        await withWhen(page, offerId!, { isFullYearAcceptable: true, durationMinDays: 10, periods: [] });
        let applied: Record<string, unknown> | null = null;
        let fail = true;
        await page.route('**/api/v1/applications', async (route) => {
            if (route.request().method() !== 'POST') return route.continue();
            if (fail) return route.abort('internetdisconnected');
            applied = route.request().postDataJSON();
            await route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ detail: 'Проверочный ответ: заявка не создана' }) });
        });
        await page.goto(`/messenger/create/${offerId}`);
        await isNewFrontend(page);
        const form = page.getByRole('form', { name: 'Отклик на вакансию' });
        await expect(form).toBeVisible({ timeout: 15_000 });
        await expect(form.getByRole('radio')).toHaveCount(0);
        // Подсказка: через неделю, на минимальный срок организатора (10 дней)
        await expect(form.getByLabel('Прибытие')).toHaveValue(apiDay(7).replaceAll('.', '-'));
        await expect(form.getByLabel('Отъезд')).toHaveValue(apiDay(16).replaceAll('.', '-'));

        const submit = form.getByRole('button', { name: 'Отправить отклик' });
        await submit.click();
        await expect(form.getByText(/нет связи/)).toBeVisible();
        fail = false;
        await submit.click();
        await expect.poll(() => applied).toMatchObject({ startDate: isoDay(7), endDate: isoDay(16) });
        // Пустое «Пару слов» не отправляется
        expect(applied).not.toHaveProperty('message');
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

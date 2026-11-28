import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

const MENU = ['Панель управления', 'Навыки', 'Отзывы', 'Заявки', 'Поддержать', 'Фото и видео', 'Написать в блог', 'Мои статьи'];

/** Заявки волонтёра для проверки карточек и отзыва: стейдж у vol@test.com заявок не держит */
const APPLICATIONS = {
    data: [
        { id: 9001, chatId: 77, startDate: '01.12.2026', endDate: '15.12.2026', isHasReview: false, status: 'new', volunteer: {}, vacancy: { id: 101, title: 'E2E: новая заявка', address: 'Москва', status: 'active', categories: [], image: null, organization: { id: 'o1', name: 'E2E: Хутор Озёрный' } } },
        { id: 9002, chatId: 78, startDate: '', endDate: '', isHasReview: false, status: 'accepted', volunteer: {}, vacancy: { id: 102, title: 'E2E: принятая заявка', address: 'Казань', status: 'active', categories: [], image: null, organization: { id: 'o2', name: 'E2E: Школа Волна' } } },
        { id: 9003, chatId: 0, startDate: '', endDate: '', isHasReview: true, status: 'canceled', volunteer: {}, vacancy: { id: 103, title: 'E2E: отклонённая заявка', address: '', status: 'active', categories: [], image: null, organization: { id: 'o3', name: 'E2E: Музей' } } },
    ],
    pagination: { total: 3, page: 1, limit: 10 },
};

/** Новый фронт: кабинет волонтёра. */
test.describe('Новый фронт: кабинет волонтёра', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка кабинета волонтёра');
        await enableNewFrontend(context);
    });

    test('панель управления: меню, заполненность профиля, отклики, уведомления', async ({ page }) => {
        const response = await page.goto('/volunteer/volunteer-dashboard');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        for (const item of MENU) {
            await expect(page.getByRole('link', { name: item }).first()).toBeVisible();
        }
        const fill = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Заполненность профиля' }) });
        await expect(fill.getByRole('listitem')).toHaveText(['О себе', 'Навыки', 'Фото', 'Видео', 'Публикации в блоге', 'Членство']);
        await expect(fill.getByText(/^\d+%$/)).toBeVisible();
        await expect(page.getByTestId('quota-value')).toHaveText(/^(∞|\d\/3)$/);
        await expect(page.getByRole('link', { name: 'Посмотреть свой профиль' })).toHaveAttribute('href', /\/volunteers\/[\w-]+$/);
        // «Редактировать профиль» заменён подсказкой «Следующий шаг» (#860): ссылка ведёт в кабинет или профиль
        const nextStep = page.getByText(/^Следующий шаг:/);
        if (await nextStep.count()) {
            await expect(nextStep.locator('xpath=following::a[1]')).toHaveAttribute('href', /^\/(profile|volunteer|membership)/);
        }
        await expect(page.getByRole('heading', { name: 'Вакансии, которые вам понравятся' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Настроить' })).toHaveAttribute('href', '/profile/preferences');
        await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();
        await expect(page.getByText('Добро пожаловать!')).toBeVisible();
    });

    test('панель управления: плашка «Оцените ваши проекты» ведёт к отзыву, «Скрыть» убирает', async ({ page }) => {
        await page.route('**/api/v1/review-reminder', (route) => route.fulfill({ json: [
            { side: 'volunteer', applicationId: 1, vacancyId: 101, vacancyTitle: 'E2E: эко-ферма', volunteerId: 'v1', volunteerName: 'Тест', endDate: '25.10.2026' },
            { side: 'host', applicationId: 2, vacancyId: 102, vacancyTitle: 'E2E: чужая сторона', volunteerId: 'v2', volunteerName: 'Анна', endDate: '20.10.2026' },
        ] }));
        await page.goto('/volunteer/volunteer-dashboard');
        const reminder = page.getByRole('region', { name: 'Оцените ваши проекты' });
        await expect(reminder.getByText('E2E: эко-ферма')).toBeVisible();
        await expect(reminder.getByText('Отъезд: 25.10.2026')).toBeVisible();
        await expect(reminder.getByText('E2E: чужая сторона')).toHaveCount(0);
        await expect(reminder.getByRole('link', { name: 'Оценить' })).toHaveAttribute('href', '/volunteer/review?vacancy=101');

        await reminder.getByRole('button', { name: 'Скрыть' }).click();
        await expect(reminder).toHaveCount(0);
        await page.reload();
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: 'Оцените ваши проекты' })).toHaveCount(0);
        await page.evaluate(() => localStorage.removeItem('gs_review_reminder_hidden_volunteer'));
    });

    test('мои заявки: поиск и вкладки с числами (GS-332)', async ({ page }) => {
        const response = await page.goto('/volunteer/notes');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Мои заявки' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Заявки' }).first()).toBeVisible();
        // GS-332: поиск и вкладки «Все / На рассмотрении / Приняты / Отклонены» с числами с сервера
        await expect(page.getByLabel('Поиск по вакансии и организатору')).toBeVisible();
        const tabs = page.getByRole('tablist', { name: 'Статус заявки' });
        for (const name of ['Все', 'На рассмотрении', 'Приняты', 'Отклонены']) {
            await expect(tabs.getByRole('tab', { name: new RegExp(`^${name}\\s*\\d+$`) })).toBeVisible();
        }
        await expect(tabs.getByRole('tab', { name: /^Все/ })).toHaveAttribute('aria-selected', 'true');
        await expect(page.getByTestId('application-card').first().or(page.getByText('Пока нет заявок'))).toBeVisible();
    });

    test('телефон: отступ «таблеток» от шапки, вкладки листаются только вбок (27.11)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/volunteer/notes');
        const tabs = page.getByRole('tablist', { name: 'Статус заявки' });
        await expect(tabs).toBeVisible({ timeout: 15_000 });
        // Лента не «плавает» вверх-вниз: по вертикали прокрутки нет, пружины нет
        const strip = await tabs.evaluate((node) => {
            const style = getComputedStyle(node);
            return { overflowY: style.overflowY, overscroll: style.overscrollBehaviorY, fits: node.scrollHeight <= node.clientHeight };
        });
        expect(strip).toEqual({ overflowY: 'hidden', overscroll: 'none', fits: true });
        // «Таблетки» кабинета не прилипают к шапке с логотипом и меню
        const header = (await page.locator('header').first().boundingBox())!;
        // Видимая «таблетка»: такие же ссылки есть в скрытом меню и боковой панели
        const pill = (await page.getByRole('link', { name: 'Заявки', exact: true }).filter({ visible: true }).first().boundingBox())!;
        expect(pill.y - (header.y + header.height)).toBeGreaterThanOrEqual(16);
    });

    test('телефон: «Поддержать» не выходит за рамку карточки проекта (27.11)', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/volunteer/donations');
        const cards = page.locator('main article');
        await expect(cards.first().or(page.getByText('На данный момент проектов нет'))).toBeVisible({ timeout: 15_000 });
        const count = Math.min(await cards.count(), 5);
        for (let index = 0; index < count; index++) {
            const card = (await cards.nth(index).boundingBox())!;
            const button = (await cards.nth(index).getByText('Поддержать', { exact: true }).boundingBox())!;
            expect(button.x).toBeGreaterThanOrEqual(card.x);
            expect(button.x + button.width).toBeLessThanOrEqual(card.x + card.width + 0.5);
            expect(button.y + button.height).toBeLessThanOrEqual(card.y + card.height + 0.5);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });

    test('мои заявки: карточка, поиск, вкладки, отзыв о принятой (GS-332)', async ({ page }) => {
        const searches: string[] = [];
        await page.route('**/api/v1/application/list-of-volunteer/counts**', (route) => route.fulfill({ json: { new: 1, accepted: 1, canceled: 1, all: 3 } }));
        await page.route(/\/api\/v1\/application\/list-of-volunteer(\?|$)/, (route) => {
            const url = new URL(route.request().url());
            const search = url.searchParams.get('search') ?? '';
            if (search) searches.push(search);
            const status = url.searchParams.get('status');
            const data = APPLICATIONS.data.filter((item) => (!status || item.status === status) && (!search || item.vacancy.organization.name.toLowerCase().includes(search.toLowerCase())));
            return route.fulfill({ json: { data, pagination: { total: data.length, page: 1, limit: 10 } } });
        });
        let review: unknown = null;
        // Настоящий отзыв не отправляем: запрос перехватывается
        await page.route('**/api/v1/review-vacancy', (route) => {
            review = route.request().postDataJSON();
            return route.fulfill({ json: {} });
        });
        await page.goto('/volunteer/notes');

        const tabs = page.getByRole('tablist', { name: 'Статус заявки' });
        await expect(tabs.getByRole('tab', { name: /^Все\s*3$/ })).toBeVisible();
        const cards = page.getByTestId('application-card');
        await expect(cards).toHaveCount(3);

        // Карточка: организатор, даты, статус и что дальше; нажатие — в переписку
        const fresh = cards.filter({ hasText: 'E2E: новая заявка' });
        await expect(fresh.getByText('E2E: Хутор Озёрный')).toBeVisible();
        await expect(fresh.getByText('01.12.2026 — 15.12.2026')).toBeVisible();
        await expect(fresh.getByText('На рассмотрении')).toBeVisible();
        await expect(fresh.getByRole('link', { name: /E2E: новая заявка/ })).toHaveAttribute('href', '/messenger/77');
        await expect(fresh.getByRole('button', { name: 'Написать отзыв' })).toHaveCount(0);
        // Без переписки карточка ведёт на вакансию
        await expect(cards.filter({ hasText: 'E2E: отклонённая заявка' }).getByRole('link', { name: /E2E: отклонённая заявка/ })).toHaveAttribute('href', '/offers/103');

        // Вкладка — в адрес и в запрос
        await tabs.getByRole('tab', { name: /^Отклонены/ }).click();
        await expect(page).toHaveURL(/[?&]status=canceled/);
        await expect(cards).toHaveCount(1);
        await tabs.getByRole('tab', { name: /^Все/ }).click();

        // Поиск по организатору
        await page.getByLabel('Поиск по вакансии и организатору').fill('волна');
        await expect(page).toHaveURL(/[?&]q=/);
        await expect(cards).toHaveCount(1);
        await expect(cards.first()).toContainText('E2E: принятая заявка');
        expect(searches).toContain('волна');

        // Ничего не нашлось — свой текст и «Сбросить поиск»
        await page.getByLabel('Поиск по вакансии и организатору').fill('яяяя');
        await expect(page.getByText('По этому запросу заявок нет', { exact: false })).toBeVisible();
        await page.getByRole('button', { name: 'Сбросить поиск' }).click();
        await expect(cards).toHaveCount(3);

        await cards.filter({ hasText: 'E2E: принятая заявка' }).getByRole('button', { name: 'Написать отзыв' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Оставьте отзыв' })).toBeVisible();
        await expect(dialog.getByText('E2E: принятая заявка')).toBeVisible();
        const send = dialog.getByRole('button', { name: 'Оставить отзыв' });
        await expect(send).toBeDisabled();
        await expect(dialog.getByText('Поставьте оценку, чтобы оставить отзыв')).toBeVisible();
        await dialog.getByRole('radio', { name: '4' }).click();
        // Текст необязателен: одной оценки достаточно
        await expect(send).toBeEnabled();
        await dialog.getByLabel('Напишите ваш отзыв').fill('Отличная поездка');
        await send.click();
        await expect(dialog.getByText('Ваш отзыв был отправлен')).toBeVisible();
        expect(review).toMatchObject({ vacancyId: 102, rating: 4, description: 'Отличная поездка' });
        await dialog.getByRole('button', { name: 'Закрыть' }).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('кабинет волонтёра уводит на вход', async ({ page }) => {
            await page.goto('/volunteer/volunteer-dashboard');
            await expect(page).toHaveURL(/\/signin/);
            await page.goto('/volunteer/notes');
            await expect(page).toHaveURL(/\/signin/);
        });
    });
});

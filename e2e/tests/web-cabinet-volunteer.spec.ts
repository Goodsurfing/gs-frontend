import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

const MENU = ['Панель управления', 'Навыки', 'Отзывы', 'Заявки', 'Поддержать', 'Фото и видео', 'Написать в блог', 'Мои статьи'];

/** Заявки волонтёра для проверки карточек и отзыва: стейдж у vol@test.com заявок не держит */
const APPLICATIONS = {
    data: [
        { id: 9001, chatId: 77, startDate: '', endDate: '', isHasReview: false, status: 'new', volunteer: {}, vacancy: { id: 101, title: 'E2E: новая заявка', address: 'Москва', status: 'active', categories: [], image: null } },
        { id: 9002, chatId: 78, startDate: '', endDate: '', isHasReview: false, status: 'accepted', volunteer: {}, vacancy: { id: 102, title: 'E2E: принятая заявка', address: 'Казань', status: 'active', categories: [], image: null } },
        { id: 9003, chatId: 0, startDate: '', endDate: '', isHasReview: true, status: 'canceled', volunteer: {}, vacancy: { id: 103, title: 'E2E: отклонённая заявка', address: '', status: 'active', categories: [], image: null } },
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
        await expect(page.getByRole('link', { name: 'Редактировать профиль' })).toHaveAttribute('href', '/volunteer/skills');
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

    test('мои заявки: три колонки и пагинация', async ({ page }) => {
        const response = await page.goto('/volunteer/notes');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('heading', { name: 'Мои заявки' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Заявки' }).first()).toBeVisible();
        for (const column of ['Новые', 'Принято', 'Отклонено']) {
            await expect(page.getByRole('region', { name: column })).toBeVisible();
        }
        await expect(page.getByRole('navigation', { name: 'Страницы' })).toBeVisible();
    });

    test('мои заявки: карточки по статусам, отзыв о принятой', async ({ page }) => {
        await page.route('**/api/v1/application/list-of-volunteer**', (route) => route.fulfill({ json: APPLICATIONS }));
        let review: unknown = null;
        // Настоящий отзыв не отправляем: запрос перехватывается
        await page.route('**/api/v1/review-vacancy', (route) => {
            review = route.request().postDataJSON();
            return route.fulfill({ json: {} });
        });
        await page.goto('/volunteer/notes');

        const fresh = page.getByRole('region', { name: 'Новые' });
        await expect(fresh.getByText('E2E: новая заявка')).toBeVisible();
        await expect(fresh.getByRole('link', { name: 'Сообщение' })).toHaveAttribute('href', '/messenger/77');
        await expect(fresh.getByRole('button', { name: 'Написать отзыв' })).toHaveCount(0);
        const canceled = page.getByRole('region', { name: 'Отклонено' });
        await expect(canceled.getByText('E2E: отклонённая заявка')).toBeVisible();
        await expect(canceled.getByRole('link', { name: 'Сообщение' })).toHaveCount(0);

        await page.getByRole('region', { name: 'Принято' }).getByRole('button', { name: 'Написать отзыв' }).click();
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

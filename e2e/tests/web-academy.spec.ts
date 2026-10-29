import { test, expect, type Page } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Первый урок первого курса: из списка курсов в курс, из курса в урок */
const openFirstLesson = async (page: Page) => {
    await page.goto('/academy-main');
    await page.locator('a[href^="/academy-course/"]').first().click();
    await expect(page).toHaveURL(/\/academy-course\//);
    const lesson = page.locator('a[href^="/academy-lesson/"]').first();
    await expect(lesson).toBeVisible();
    await lesson.click();
    await expect(page).toHaveURL(/\/academy-lesson\//);
};

/** Новый фронт: академия — курсы, курс, урок. */
test.describe('Новый фронт: академия', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('курсы, страница курса и урок с приглашением войти', async ({ page }) => {
            const response = await page.goto('/academy-main');
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { level: 1, name: 'Учитесь гудсёрфингу вместе с нами!' })).toBeVisible();
            await expect(page.getByRole('heading', { level: 2, name: 'Курсы' })).toBeVisible();
            await expect(page.locator('a[href^="/academy-course/"]').first()).toContainText('Пройти курс');

            await page.locator('a[href^="/academy-course/"]').first().click();
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
            await expect(page.getByRole('heading', { level: 2, name: 'Видео' })).toBeVisible();
            await expect(page.getByRole('progressbar', { name: 'Прогресс по курсу' })).toHaveAttribute('aria-valuenow', '0');
            await page.getByRole('button', { name: 'Начать обучение' }).click();
            await expect(page.locator('#lessons')).toBeInViewport();

            await page.locator('a[href^="/academy-lesson/"]').first().click();
            await expect(page.getByText('Видео доступно только для зарегистрированных пользователей')).toBeVisible();
            await expect(page.getByText('Чтобы оставить отзыв на курс нужно авторизоваться')).toBeVisible();
            await expect(page.getByRole('link', { name: 'Авторизоваться' }).first()).toHaveAttribute('href', '/signin');
        });

        test('несуществующий курс — сообщение', async ({ page }) => {
            await page.goto('/academy-course/00000000-0000-0000-0000-000000000000');
            await expect(page.getByText('Курс не был найден')).toBeVisible();
        });
    });

    test('волонтёр: урок с видео, крошками и форма отзыва', async ({ page }) => {
        await openFirstLesson(page);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Курсы' }).first()).toHaveAttribute('href', '/academy-main');
        await expect(page.locator('iframe, video').first()).toBeAttached();
        await expect(page.getByRole('radiogroup', { name: 'Ваш отзыв' })).toBeVisible();
        await expect(page.getByRole('link', { name: /Следующая лекция/ })).toBeVisible();
    });
});

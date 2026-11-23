import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * «Укажите почту» для вошедших через VK без почты (решение бизнеса 23.11.2026).
 * Аккаунта VK без почты на стенде нет — ответ «почта-заглушка» подставляется, отправка письма
 * перехватывается (настоящая смена почты тестовому аккаунту не нужна).
 */
const VK_STATE = { email: '123456789@vkontakte.ru', hasPassword: false, pending: null };

test.describe('Новый фронт: почта для вошедших через VK', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'кабинет волонтёра');
        await enableNewFrontend(context);
    });

    test('плашка в кабинете: почта уходит на подтверждение, «Позже» прячет', async ({ page }) => {
        await page.route('**/api/v1/email-change', async (route) => {
            if (route.request().method() === 'POST') {
                expect(route.request().postDataJSON()).toMatchObject({ newEmail: 'traveller@example.org', password: null });
                return route.fulfill({ status: 202, json: { sentTo: 'traveller@example.org' } });
            }
            return route.fulfill({ json: VK_STATE });
        });
        await page.goto('/volunteer/volunteer-dashboard');
        await page.evaluate(() => localStorage.removeItem('gs.vkEmailPromptHidden'));
        await page.reload();

        const prompt = page.getByRole('region', { name: 'Укажите почту' });
        await expect(prompt).toBeVisible();
        await prompt.getByLabel('Ваша почта').fill('traveller@example.org');
        await prompt.getByRole('button', { name: 'Сохранить почту' }).click();
        await expect(prompt.getByRole('status')).toContainText('traveller@example.org');

        // «Позже» — до следующего визита через 3 дня
        await page.reload();
        await page.getByRole('region', { name: 'Укажите почту' }).getByRole('button', { name: 'Позже' }).click();
        await expect(page.getByRole('region', { name: 'Укажите почту' })).toHaveCount(0);
        await page.reload();
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: 'Укажите почту' })).toHaveCount(0);
        await page.evaluate(() => localStorage.removeItem('gs.vkEmailPromptHidden'));
    });

    test('у пользователя с настоящей почтой плашки нет', async ({ page }) => {
        await page.goto('/volunteer/volunteer-dashboard');
        await expect(page.getByRole('heading', { name: 'Заполненность профиля' })).toBeVisible();
        await expect(page.getByRole('region', { name: 'Укажите почту' })).toHaveCount(0);
    });
});

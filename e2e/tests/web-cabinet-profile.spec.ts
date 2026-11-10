import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: кабинет, раздел «Профиль». */
test.describe('Новый фронт: кабинет — профиль', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка кабинета волонтёра');
        await enableNewFrontend(context);
    });

    test('«Обо мне»: меню раздела, данные профиля, сохранение блокирует форму', async ({ page }) => {
        const response = await page.goto('/profile/info');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { name: 'Основная информация' })).toBeVisible();
        for (const item of ['Обо мне', 'Предпочтения', 'Роль', 'Пароль', 'Приватность']) {
            await expect(page.getByRole('link', { name: item }).first()).toBeVisible();
        }
        await expect(page.getByLabel('E-mail')).toHaveValue('vol@test.com');
        await expect(page.getByLabel('E-mail')).toBeDisabled();

        // Форма всегда открыта для правки (#851): «Сохранить» активна только при изменениях
        const save = page.getByRole('button', { name: 'Сохранить', exact: true });
        await expect(save).toBeDisabled();
        const city = page.getByLabel('Город');
        const before = await city.inputValue();
        await city.fill(`E2E-город ${Date.now() % 1000}`);
        await expect(page.getByText('Есть несохранённые изменения')).toBeVisible();
        await save.click();
        await expect(page.getByText('Данные успешно изменены')).toBeVisible();
        await expect(save).toBeDisabled();
        // Вернуть как было (данные стейджа общие для всех прогонов)
        await city.fill(before);
        await save.click();
        await expect(save).toBeDisabled();
    });

    test('предпочтения, роль, пароль, приватность открываются и показывают свои разделы', async ({ page }) => {
        await page.goto('/profile/preferences');
        await expect(page.getByRole('heading', { name: 'Какой тип путешествий вы предпочитаете' })).toBeVisible();
        await expect(page.locator('button[aria-pressed]').first()).toBeVisible();

        await page.goto('/profile/role');
        await expect(page.getByText('Гудсёрфер', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Вы уже стали гудсёрфером' })).toBeVisible();

        await page.goto('/profile/reset-password');
        await expect(page.getByRole('heading', { name: 'Изменение пароля' })).toBeVisible();
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect(page.getByText('Новый пароль обязателен')).toBeVisible();

        await page.goto('/profile/privacy');
        await expect(page.getByRole('switch', { name: 'Деактивировать и скрыть мой аккаунт' })).toBeVisible();
        // Удаление — только открыть и закрыть подтверждение, настоящий DELETE не отправляем
        await page.getByRole('button', { name: 'Удалить аккаунт' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.getByRole('button', { name: 'Отмена' }).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('кабинет уводит на вход', async ({ page }) => {
            await page.goto('/profile/info');
            await expect(page).toHaveURL(/\/signin/);
        });
    });
});

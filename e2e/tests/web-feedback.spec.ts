import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: «Обратная связь» — кнопка доступна только при заполненной форме. */
test.describe('Новый фронт: обратная связь', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test('проверка полей', async ({ page }) => {
        const response = await page.goto('/feedback');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        const send = page.getByRole('button', { name: 'Отправить' });
        await expect(send).toBeDisabled();
        await page.getByLabel('Ваше имя').fill('Проверка');
        await page.getByLabel('E-mail').fill('not-an-email');
        await page.getByLabel('Сообщение').fill('Текст');
        await expect(send).toBeDisabled();
        await page.getByLabel('E-mail').fill('check@example.com');
        await expect(send).toBeEnabled();
    });
});

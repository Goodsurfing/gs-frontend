import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: «Стать организатором» (BecomeHostPage старого фронта). */
test.describe('Новый фронт: стать организатором', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test('разделы и кнопки ведут на выбор роли', async ({ page }) => {
        const response = await page.goto('/become-host');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { level: 1 })).toContainText('Принимай у себя гудсёрферов');
        for (const title of ['Кто может приглашать гудсёрферов', 'Чем могут помочь гудсёрферы', 'Что вы предлагаете взамен', 'Зачем пользоваться Гудсёрфингом']) {
            await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
        }
        const buttons = page.getByRole('link', { name: /Стать хостом|Начать сейчас|Начните принимать/ });
        expect(await buttons.count()).toBeGreaterThanOrEqual(4);
        for (const href of await buttons.evaluateAll((links) => links.map((link) => link.getAttribute('href')))) expect(href).toBe('/profile/role');
    });
});

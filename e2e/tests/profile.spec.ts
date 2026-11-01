import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { authHeaders, createSession, useSessionInPage } from '../support/session';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

// PNG 1×1 — аватар для проверки загрузки
const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC',
    'base64',
);

/** GS-214: редактирование профиля и аватар — на одноразовом пользователе. */
test.describe('Профиль', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('изменения сохраняются и видны после перезагрузки; аватар загружается', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        test.setTimeout(90_000);

        const session = await createSession('profile');
        await useSessionInPage(page, session);
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const profile = async () => (await api.get('/api/v1/profile', { headers: authHeaders(session) })).json();

        const about = `Проверка профиля ${Date.now()}`;
        await page.goto('/profile/info');
        await page.getByLabel('Фамилия').fill('Проверкин');
        await page.getByLabel('Расскажите о себе').fill(about);
        await page.getByRole('button', { name: 'Сохранить' }).click();

        await expect.poll(async () => (await profile()).aboutMe, { timeout: 15_000 }).toBe(about);
        await page.reload();
        await expect(page.getByLabel('Фамилия')).toHaveValue('Проверкин');
        await expect(page.getByLabel('Расскажите о себе')).toHaveValue(about);

        const uploaded = page.waitForResponse((r) => r.url().includes('/media_objects') && r.request().method() === 'POST');
        await page.locator('input[type="file"]').first().setInputFiles({
            name: 'avatar-e2e.png', mimeType: 'image/png', buffer: PNG,
        });
        expect((await uploaded).status()).toBe(201);
        // Аватар привязывается к профилю при сохранении формы
        await page.getByRole('button', { name: 'Сохранить' }).click();
        await expect.poll(async () => (await profile()).image?.contentUrl ?? null, { timeout: 20_000 })
            .toContain('avatar-e2e');
        await api.dispose();
    });
});

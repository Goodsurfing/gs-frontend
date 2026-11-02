import { test, expect, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

const accessToken = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null') as string | null);

/** Новый фронт: рабочий стол организатора и заявки по колонкам. */
test.describe('Новый фронт: рабочий стол и заявки организатора', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        await enableNewFrontend(context);
    });

    test('рабочий стол: заполненность, заявки, уведомления', async ({ page }) => {
        const response = await page.goto('/host/host-dashboard');
        expect(response?.status()).toBe(200);
        await expect(page.getByRole('link', { name: 'Редактировать профиль' })).toHaveAttribute('href', '/host/info');
        await expect(page.getByRole('heading', { name: 'Заявки' })).toBeVisible();
        await expect(page.getByText(/Новых заявок: \d+/)).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();
        await expect(page.getByText('Добро пожаловать!')).toBeVisible();
    });

    test('заявки: три колонки, «Принять» переносит заявку в «Принято»', async ({ page }) => {
        await page.goto('/host/notes');
        await expect(page.getByRole('heading', { name: 'Мои заявки' })).toBeVisible();
        await expect(page.getByLabel('Вакансия')).toHaveValue('');
        const fresh = page.getByRole('region', { name: 'Новые' });
        const accepted = page.getByRole('region', { name: 'Принято' });
        await expect(fresh).toBeVisible();
        await expect(accepted).toBeVisible();
        await expect(page.getByRole('region', { name: 'Отклонено' })).toBeVisible();

        const accept = fresh.getByRole('button', { name: 'Принять' }).first();
        test.skip(!(await accept.count()), 'нет новых заявок');
        const href = await fresh.locator('a[href^="/offers/"]').first().getAttribute('href');
        const before = Number(await accepted.locator('span').nth(1).textContent());
        // Какую заявку принимаем — по ответу PATCH, чтобы вернуть её в «Новые»
        const patched = page.waitForResponse((r) => r.url().includes('/application_forms/') && r.request().method() === 'PATCH');
        await accept.click();
        const id = (await patched).url().match(/application_forms\/(\d+)\/status/)?.[1];
        try {
            await expect(accepted.locator('span').nth(1)).toHaveText(String(before + 1));
            expect(href).toBeTruthy();
        } finally {
            await page.request.patch(`${API_URL}/api/v1/application_forms/${id}/status`, {
                headers: { Authorization: `Bearer ${await accessToken(page)}`, 'Content-Type': 'application/merge-patch+json' },
                data: { status: 'new' },
            });
        }
    });
});

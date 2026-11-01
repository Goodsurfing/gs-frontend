import { test, expect, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

const accessToken = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null') as string | null);

/** Новый фронт: кабинет организатора — вакансии, сборы, пожертвования. */
test.describe('Новый фронт: вакансии, сборы и пожертвования организатора', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        await enableNewFrontend(context);
    });

    test('«Мои вакансии»: карточки, подтверждение без изменений, кнопка «Добавить вакансию»', async ({ page }) => {
        await page.goto('/host/my-offers');
        await expect(page.getByRole('heading', { name: 'Мои вакансии' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Добавить вакансию' })).toBeEnabled();
        const remove = page.getByRole('button', { name: 'Удалить', exact: true }).first();
        if (await remove.count()) {
            await remove.click();
            const dialog = page.getByRole('dialog');
            await expect(dialog.getByText('Вы уверены, что хотите удалить вакансию?')).toBeVisible();
            await dialog.getByRole('button', { name: 'Отмена' }).click();
            await expect(dialog).toHaveCount(0);
        }
    });

    test('«Мои сборы»: черновик в списке, удаление через подтверждение', async ({ page }) => {
        await page.goto('/host/donations');
        await expect(page.getByRole('heading', { name: 'Мои сборы' })).toBeVisible();
        // Черновик сбора создаётся через API (как «Добавить сбор»; нужно членство организатора)
        const created = await page.request.post(`${API_URL}/api/v1/fundraise`, { headers: { Authorization: `Bearer ${await accessToken(page)}`, Accept: 'application/json' } });
        test.skip(!created.ok(), 'у организатора нет членства — сбор не создать');
        const { id } = await created.json() as { id: string };
        await page.reload();
        const card = page.locator(`a[href="/fundraise/${id}"]`).locator('..');
        await expect(page.getByRole('heading', { name: 'Черновики' })).toBeVisible();
        await card.getByRole('button', { name: 'Удалить' }).click();
        await page.getByRole('dialog').getByRole('button', { name: 'Ок' }).click();
        await expect(page.locator(`a[href="/fundraise/${id}"]`)).toHaveCount(0);
    });

    test('«Пожертвования»: фильтры и таблица', async ({ page }) => {
        await page.goto('/host/donation-rating');
        await expect(page.getByRole('heading', { name: 'Пожертвования' })).toBeVisible();
        await expect(page.getByLabel('Поиск участника')).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Сумма пожертвования, руб.' })).toBeVisible();
        await page.getByLabel('Поиск участника').fill('ничего такого нет');
        await expect(page.getByText('Никого не найдено')).toBeVisible();
    });
});

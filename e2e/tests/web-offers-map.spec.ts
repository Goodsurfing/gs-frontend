import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

/** Новый фронт: каталог вакансий — список, фильтры в адресе, карта. */
test.describe('Новый фронт: каталог вакансий', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'проверка без привязки к роли — один раз за прогон');
        await enableNewFrontend(context);
    });

    test('десктоп: выбор вакансии в списке открывает её на карте и пишет в адрес', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const response = await page.goto('/offers-map');
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByText(/^\d+ вариант/)).toBeVisible();

        // Первая вакансия, у которой есть координаты
        const card = page.locator('[role="button"][aria-pressed]').filter({ hasNotText: 'нет на карте' }).first();
        const title = (await card.locator('p').first().textContent())?.trim() ?? '';
        await card.click();
        await expect(card).toHaveAttribute('aria-pressed', 'true');
        await expect(page).toHaveURL(/offerId=\d+/);
        await expect(page.getByRole('dialog').filter({ hasText: title.slice(0, 20) })).toBeVisible({ timeout: 20_000 });
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('фильтры, «Показать прошедшие» и сортировка — в адресе', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/offers-map');
        const before = Number((await page.getByText(/^\d+ вариант/).textContent())?.match(/\d+/)?.[0]);

        await page.getByRole('button', { name: 'Доп. фильтры' }).first().click();
        await page.getByLabel('Можно с детьми').first().check();
        await page.getByRole('button', { name: 'Применить' }).first().click();
        await expect(page).toHaveURL(/kids=1/);
        const after = Number((await page.getByText(/^\d+ вариант/).textContent())?.match(/\d+/)?.[0]);
        expect(after).toBeLessThan(before);

        await page.getByRole('switch', { name: 'Показать прошедшие' }).first().click();
        await expect(page).toHaveURL(/past=0/);
        await expect(page.getByRole('switch', { name: 'Показать прошедшие' }).first()).toHaveAttribute('aria-checked', 'false');

        await page.getByRole('combobox', { name: 'По новизне' }).first().selectOption('popularity');
        await expect(page).toHaveURL(/sort=popularity/);

        await page.getByRole('button', { name: 'Очистить все' }).first().click();
        await expect(page).toHaveURL(/\/offers-map$/);
    });

    test('телефон: вкладки «Список вакансий», «Карта», «Фильтр»', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/offers-map');
        await expect(page.locator('[role="button"][aria-pressed]').first()).toBeVisible();
        await page.getByRole('button', { name: 'Карта', exact: true }).click();
        await expect(page.getByRole('button', { name: 'Приблизить' })).toBeVisible({ timeout: 20_000 });
        await page.getByRole('button', { name: 'Фильтр', exact: true }).click();
        await expect(page.getByRole('button', { name: 'Направление деятельности' }).last()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });
});

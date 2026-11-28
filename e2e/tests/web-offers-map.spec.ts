import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';
import { API_URL } from '../config';

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
        // На десктопе «Применить» нет: фильтр срабатывает сам, когда список закрыли
        await page.keyboard.press('Escape');
        await expect(page).toHaveURL(/kids=1/);
        const after = Number((await page.getByText(/^\d+ вариант/).textContent())?.match(/\d+/)?.[0]);
        expect(after).toBeLessThan(before);

        // Прошедшие по умолчанию скрыты, переключатель их показывает
        await expect(page.getByRole('switch', { name: 'Показать прошедшие' }).first()).toHaveAttribute('aria-checked', 'false');
        await page.getByRole('switch', { name: 'Показать прошедшие' }).first().click();
        await expect(page).toHaveURL(/past=1/);
        await expect(page.getByRole('switch', { name: 'Показать прошедшие' }).first()).toHaveAttribute('aria-checked', 'true');
        // Дождаться, пока список обновится после переключателя: иначе на медленной машине CI
        // выбор сортировки попадает в незавершённый переход и теряется
        await page.waitForLoadState('networkidle');

        await page.getByRole('combobox', { name: 'По новизне' }).first().selectOption('popularity');
        await expect(page).toHaveURL(/sort=popularity/);

        await page.getByRole('button', { name: 'Очистить все' }).first().click();
        await expect(page).toHaveURL(/\/offers-map$/);
    });

    test('«Круглый год» — галочка вместо дат, в адресе year=1 (27.11)', async ({ page, request }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        // Сколько «круглый год» по API — с тем же «скрыть прошедшие», что шлёт сайт по умолчанию
        // (у «круглого года» — только с открытым приёмом заявок, периоды не учитываются)
        const api = await (await request.get(`${API_URL}/api/v1/vacancy?fullYear=true&hidePassed=true&page=1&limit=1&fields=card`)).json();
        const expected = Number(api.pagination.total);
        expect(expected).toBeGreaterThan(0);
        await page.goto('/offers-map');
        const count = async () => Number((await page.getByText(/^\d+ вариант/).textContent())?.match(/\d+/)?.[0]);
        // «Круглый год показываем» (28.11.2026): без фильтров видно всё, что даёт галочка, и ещё датированные
        await expect.poll(count).toBeGreaterThan(expected);
        await page.getByLabel('Круглый год').first().check();
        await expect(page).toHaveURL(/year=1/);
        await expect(page.getByLabel('Дата начала').first()).toBeDisabled();
        await expect.poll(count).toBe(expected);
        // Ссылкой тоже работает: галочка стоит после перезагрузки
        await page.reload();
        await expect(page.getByLabel('Круглый год').first()).toBeChecked();
        await page.getByLabel('Круглый год').first().uncheck();
        await expect(page).not.toHaveURL(/year=1/);
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

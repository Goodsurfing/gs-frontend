import { test, expect, type Page } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/** Токен входа старого SPA из localStorage (так его берёт и новый фронт в переходный период) */
const accessToken = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null') as string | null);

/** Новый фронт: кабинет организатора — описание, создание организации, команда. */
test.describe('Новый фронт: кабинет организатора', () => {
    test.beforeEach(async ({ context }) => {
        await enableNewFrontend(context);
    });

    test.describe('организатор', () => {
        test.beforeEach(({}, testInfo) => {
            test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        });

        test('«Описание»: меню организатора, данные организации, проверка и сохранение', async ({ page }) => {
            const response = await page.goto('/host/info');
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { name: 'Основная информация' })).toBeVisible();
            for (const item of ['Рабочий стол', 'Вакансии', 'Заявки', 'Сборы', 'Пожертвования', 'Описание', 'Фото', 'Видео', 'Команда', 'Отзывы']) {
                await expect(page.getByRole('link', { name: item, exact: true }).first()).toBeVisible();
            }
            const name = page.getByLabel('Название организации');
            await expect(name).not.toHaveValue('');
            const original = await name.inputValue();

            // Пустое название — сообщение под полем, запрос не уходит
            await name.fill('');
            await page.getByRole('button', { name: 'Сохранить' }).click();
            await expect(page.getByText('Это поле является обязательным')).toBeVisible();
            await name.fill(original);

            // Своё значение типа; после проверки — вернуть прежнее через API
            const before = await page.request.get(`${API_URL}/api/v1/personal/organization`, {
                headers: { Authorization: `Bearer ${await accessToken(page)}`, Accept: 'application/json' },
            }).then((r) => r.json() as Promise<{ id: string; type?: string }>);
            try {
                await page.getByLabel('Тип организации', { exact: true }).selectOption('Другое');
                await page.getByLabel('Укажите тип организации *').fill('E2E тип');
                await page.getByRole('button', { name: 'Сохранить' }).click();
                await expect(page.getByText('Данные успешно изменены')).toBeVisible();
                await page.reload();
                await expect(page.getByLabel('Укажите тип организации *')).toHaveValue('E2E тип');
            } finally {
                await page.request.patch(`${API_URL}/api/v1/organizations/${before.id}`, {
                    headers: { Authorization: `Bearer ${await accessToken(page)}`, 'Content-Type': 'application/merge-patch+json' },
                    data: { type: before.type ?? '' },
                });
            }
        });

        test('«Команда» показывает пояснение; организатора с организацией «Создание» уводит на описание', async ({ page }) => {
            await page.goto('/host/team');
            await expect(page.getByRole('heading', { name: 'Команда организации' })).toBeVisible();
            await expect(page.getByText('Функция станет доступна позже')).toBeVisible();

            await page.goto('/host/register');
            await expect(page).toHaveURL(/\/host\/info$/);
        });
    });

    test.describe('волонтёр без организации', () => {
        test.beforeEach(({}, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'нужен пользователь без организации');
        });

        test('«Создание организации»: пустая форма, кабинет организатора — на выбор роли', async ({ page }) => {
            await page.goto('/host/register');
            await expect(page.getByRole('heading', { name: 'Создание организации' })).toBeVisible();
            await expect(page.getByLabel('Название организации')).toHaveValue('');
            await expect(page.getByLabel('Тип организации', { exact: true })).toHaveValue('ИП');
            // Без названия организация не создаётся
            await page.getByRole('button', { name: 'Сохранить' }).click();
            await expect(page.getByText('Это поле является обязательным')).toBeVisible();

            await page.goto('/host/info');
            await expect(page).toHaveURL(/\/profile\/role/);
        });
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('кабинет организатора и создание организации уводят на вход', async ({ page }) => {
            await page.goto('/host/info');
            await expect(page).toHaveURL(/\/signin/);
            await page.goto('/host/register');
            await expect(page).toHaveURL(/\/signin/);
        });
    });
});

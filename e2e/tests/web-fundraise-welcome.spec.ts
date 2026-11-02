import { test, expect } from '@playwright/test';
import { enableNewFrontend } from '../support/newFrontend';

// Приветствие ничего не запрашивает — годится любой id
const ID = '00000000-0000-0000-0000-000000000000';

/** Новый фронт: приветствие перед мастером сбора и голый /fundraise. */
test.describe('Новый фронт: приветствие сбора', () => {
    test.beforeEach(async ({ context }) => {
        await enableNewFrontend(context);
    });

    test('организатор видит приветствие, меню мастера и «Начать» на первый шаг', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        const response = await page.goto(`/fundraise/welcome/${ID}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
        await expect(page.getByRole('heading', { name: 'Привет!' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Начать' })).toHaveAttribute('href', `/fundraise/where/${ID}`);
        await expect(page.getByRole('link', { name: 'К сборам' }).first()).toHaveAttribute('href', '/host/donations');
        for (const [name, step] of [['Где', 'where'], ['Когда', 'when'], ['Сколько', 'amount'], ['Описание', 'description'], ['Настройка автоматических сообщений', 'auto-messages']]) {
            await expect(page.getByRole('link', { name, exact: true }).first()).toHaveAttribute('href', `/fundraise/${step}/${ID}`);
        }
    });

    test('волонтёра без организации уводит на выбор роли', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'нужен пользователь без организации');
        await page.goto(`/fundraise/welcome/${ID}`);
        await expect(page).toHaveURL(/\/profile\/role/);
    });

    test('голый /fundraise ведёт к списку сборов', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'host', 'кабинет организатора');
        await page.goto('/fundraise');
        await expect(page).toHaveURL(/\/host\/donations$/);
    });
});

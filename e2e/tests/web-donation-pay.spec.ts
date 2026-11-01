import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

const activeFundraiseId = async (request: APIRequestContext) => {
    const response = await request.get(`${API_URL}/api/v1/fundraise?page=1&limit=20`);
    const body = await response.json() as { data: { id: string; status?: string }[] };
    const fundraise = body.data.find((item) => item.status !== 'draft') ?? body.data[0];
    expect(fundraise, 'на стейдже нет ни одного сбора').toBeTruthy();
    return fundraise!.id;
};

/**
 * Новый фронт: пожертвование. Сам платёж здесь не проводится — форма
 * создаёт платёж и уводит на ЮKassa; живая оплата тестовой картой — вручную
 * после выкладки (правило для оплаты).
 */
test.describe('Новый фронт: пожертвование', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('оплата без входа уводит на вход с возвратом к сбору', async ({ page, request }) => {
            const id = await activeFundraiseId(request);
            await page.goto(`/donation/pay/${id}`);
            await expect(page).toHaveURL(new RegExp(`/signin\\?next=donation&nextId=${id}`));
        });

        test('итоги оплаты: «Спасибо» и «Платёж не прошёл» с причиной', async ({ page, request }) => {
            const id = await activeFundraiseId(request);
            await page.goto(`/donation/success/${id}`);
            await expect(page.getByRole('heading', { level: 1, name: 'Спасибо за пожертвование!' })).toBeVisible();
            await expect(page.getByRole('link', { name: 'Вернуться к сбору' })).toHaveAttribute('href', `/fundraise/${id}`);

            await page.goto(`/donation/fail/${id}?reason=cancelled`);
            await expect(page.getByRole('heading', { level: 1, name: 'Платёж не прошёл' })).toBeVisible();
            await expect(page.getByText('Платёж был отменён')).toBeVisible();
            await expect(page.getByRole('link', { name: 'Попробовать снова' })).toHaveAttribute('href', `/donation/pay/${id}`);
        });
    });

    test('волонтёр: форма проверяет сумму и уводит на страницу оплаты ЮKassa', async ({ page, request }) => {
        const id = await activeFundraiseId(request);
        await page.goto(`/donation/pay/${id}`);
        await expect(page.getByRole('heading', { level: 1, name: 'Пожертвование' })).toBeVisible();
        await expect(page.getByRole('button', { name: '1500 ₽', exact: true })).toHaveAttribute('aria-pressed', 'true');

        await page.getByLabel('Другая сумма, ₽').fill('50');
        await page.getByRole('button', { name: /Поддержать — 50 ₽/ }).click();
        await expect(page.getByRole('alert').filter({ hasText: 'Минимальная сумма пожертвования — 100 ₽' })).toBeVisible();

        await page.getByLabel('Другая сумма, ₽').fill('100');
        await page.getByRole('button', { name: /Поддержать — 100 ₽/ }).click();
        await page.waitForURL(/yoomoney\.ru|yookassa\.ru/, { timeout: 30_000 });
    });
});

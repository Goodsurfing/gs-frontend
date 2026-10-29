import { test, expect, type APIRequestContext } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/** Активный сбор со стейджа — страница сбора общая для всех */
const activeFundraiseId = async (request: APIRequestContext) => {
    const response = await request.get(`${API_URL}/api/v1/fundraise?page=1&limit=20`);
    const body = await response.json() as { data: { id: string; status?: string }[] };
    const fundraise = body.data.find((item) => item.status !== 'draft') ?? body.data[0];
    expect(fundraise, 'на стейдже нет ни одного сбора').toBeTruthy();
    return fundraise!.id;
};

/** Новый фронт: страница сбора пожертвований. */
test.describe('Новый фронт: страница сбора', () => {
    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('карточка, разделы, «Поддержать» ведёт на вход с возвратом к сбору', async ({ page, request }) => {
            const id = await activeFundraiseId(request);
            const response = await page.goto(`/fundraise/${id}`);
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
            await expect(page.getByText('Дата старта')).toBeVisible();
            await expect(page.getByRole('heading', { name: 'Участники сбора' })).toBeVisible();
            await expect(page.getByText('Поделиться сбором')).toBeVisible();
            await expect(page.getByRole('link', { name: 'Поддержать' }).first()).toHaveAttribute('href', `/signin?next=donation&nextId=${id}`);
        });
    });

    test('волонтёр: «Поддержать» ведёт к оплате', async ({ page, request }) => {
        const id = await activeFundraiseId(request);
        await page.goto(`/fundraise/${id}`);
        await expect(page.getByRole('link', { name: 'Поддержать' }).first()).toHaveAttribute('href', `/donation/pay/${id}`);
    });
});

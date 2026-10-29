import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

const KINDS = [
    { api: 'news', path: '/news', crumb: 'Новости' },
    { api: 'blog', path: '/blog', crumb: 'Блог' },
    { api: 'journal', path: '/journals', crumb: 'Журналы' },
    { api: 'video', path: '/video', crumb: 'Видео' },
];

/** Новый фронт: страницы новости, статьи блога, журнала и видео. */
test.describe('Новый фронт: страницы материалов', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ context }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
        await enableNewFrontend(context);
    });

    for (const kind of KINDS) {
        test(`${kind.path}/…: крошки, заголовок, лайк гостю — подсказка, комментарии`, async ({ page }) => {
            const api = await request.newContext();
            const item = (await (await api.get(`${API_URL}/api/v1/${kind.api}?page=1&limit=1&lang=ru`)).json())?.data?.[0];
            test.skip(!item, 'нет материалов');
            const response = await page.goto(`${kind.path}/${item.slug ?? item.id}`);
            expect(response?.status()).toBe(200);
            await expect(page.locator('script[src*="/_next/"]').first()).toBeAttached();
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.name);
            await expect(page.getByRole('link', { name: kind.crumb, exact: true }).first()).toHaveAttribute('href', kind.path);
            await page.getByRole('button', { name: /likes/ }).click();
            await expect(page.getByRole('alert').filter({ hasText: 'нужно авторизоваться' })).toBeVisible();
            await expect(page.getByText(/\d+ комментариев/)).toBeVisible();
        });
    }

    test('несуществующая статья — 404', async ({ page }) => {
        await page.goto('/blog/net-takoi-stati-123456');
        await expect(page.getByText('404')).toBeVisible();
    });
});

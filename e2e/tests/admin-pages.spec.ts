import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { expectPageWorks } from '../support/pageCheck';
import { createSession, E2eSession, useSessionInPage } from '../support/session';
import { hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

/**
 * GS-214: разделы админки открываются у администратора без ошибок.
 * Администратор одноразовый (@test.local), создаётся через /api/test/create-user
 * за токеном; ночной restore стейджа его удаляет.
 */
// Отзывы о новостях, блоге, журналах и видео — вкладки /admin/reviews-community;
// /admin/reviews-news и т. п. — только основа адреса карточки отзыва (:id).
const SECTIONS = [
    '/admin/users',
    '/admin/organizations',
    '/admin/vacancies',
    '/admin/donations',
    '/admin/donation-reports',
    '/admin/feedback',
    '/admin/reviews',
    '/admin/skills-achievements',
    '/admin/categories-vacancies',
    '/admin/conditions-vacancies',
    '/admin/courses',
    '/admin/reviews-courses',
    '/admin/news',
    '/admin/reviews-community',
    '/admin/categories-blog',
    '/admin/blog',
    '/admin/journals',
    '/admin/video',
    '/admin/ambassadors',
    '/admin/our-team',
    '/admin/about-project',
    '/admin/banner-marketing',
    '/admin/system-admin',
];

test.describe('Админка', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    let auth: E2eSession;

    test.beforeAll(async () => {
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        auth = await createSession('admin', { admin: true });
        expect(auth.roles).toContain('ROLE_ADMIN');
    });

    test.beforeEach(async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
        await useSessionInPage(page, auth);
    });

    for (const path of SECTIONS) {
        test(path, async ({ page }) => {
            await expectPageWorks(page, `${path}`);
        });
    }

    test('карточки пользователя и организации', async ({ page }) => {
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const headers = { Authorization: `Bearer ${auth.accessToken}` };
        const users = await (await api.get('/admin/v1/user?page=1&limit=1', { headers })).json();
        const orgs = await (await api.get('/admin/v1/organization?page=1&limit=1', { headers })).json();
        await api.dispose();

        const userId = users?.data?.[0]?.id;
        const orgId = orgs?.data?.[0]?.id;
        expect(userId, 'список пользователей пуст').toBeTruthy();
        expect(orgId, 'список организаций пуст').toBeTruthy();

        await expectPageWorks(page, `/admin/users/${userId}`);
        await expectPageWorks(page, `/admin/organizations/${orgId}`);
    });

    test('обычного пользователя в админку не пускает', async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'e2e/.auth/vol.json' });
        const page = await ctx.newPage();
        await page.goto('/admin/users');
        await expect(page).not.toHaveURL(/\/admin\/users$/, { timeout: 15_000 });
        await ctx.close();
    });
});

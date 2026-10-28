import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';
import { expectPageWorks } from '../support/pageCheck';
import { e2eHeaders, hasE2eToken, NO_TOKEN_REASON } from '../support/testApi';

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

    let auth: { email: string; accessToken: string; mercureToken: string; roles: string[] };

    test.beforeAll(async () => {
        test.skip(!hasE2eToken(), NO_TOKEN_REASON);
        const api = await request.newContext({ baseURL: API_URL, ignoreHTTPSErrors: true });
        const email = `e2e-admin-${Date.now()}@test.local`;
        const password = 'E2eAdmin2026x';
        const created = await api.post('/api/test/create-user', {
            data: { email, password, admin: true },
            headers: e2eHeaders(),
        });
        expect(created.ok(), await created.text()).toBeTruthy();
        const login = await api.post('/api/v1/token', { data: { email, password } });
        expect(login.ok(), await login.text()).toBeTruthy();
        auth = { email, ...(await login.json()) };
        expect(auth.roles).toContain('ROLE_ADMIN');
        await api.dispose();
    });

    test.beforeEach(async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один раз на прогон');
        // Так же, как global-setup: приложение читает сессию из localStorage
        await page.addInitScript((a) => {
            localStorage.setItem('user', JSON.stringify({ username: a.email }));
            localStorage.setItem('token', JSON.stringify(a.accessToken));
            localStorage.setItem('mercureToken', JSON.stringify(a.mercureToken));
            localStorage.setItem('roles', JSON.stringify(a.roles));
        }, auth);
    });

    for (const path of SECTIONS) {
        test(path, async ({ page }) => {
            await expectPageWorks(page, `/ru${path}`);
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

        await expectPageWorks(page, `/ru/admin/users/${userId}`);
        await expectPageWorks(page, `/ru/admin/organizations/${orgId}`);
    });

    test('обычного пользователя в админку не пускает', async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'e2e/.auth/vol.json' });
        const page = await ctx.newPage();
        await page.goto('/ru/admin/users');
        await expect(page).not.toHaveURL(/\/ru\/admin\/users$/, { timeout: 15_000 });
        await ctx.close();
    });
});

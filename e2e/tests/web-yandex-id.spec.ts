import { test, expect, type Page, type Route } from '@playwright/test';
import { API_URL } from '../config';
import { enableNewFrontend } from '../support/newFrontend';

/**
 * Вход через Яндекс ID (GS-336). Настоящий Яндекс в тестах не участвует:
 * ответы бэкенда (обмен кода, привязки) подменяются, поток (state, verifier)
 * кладётся в sessionStorage так же, как его кладёт кнопка.
 *
 * Есть ли кнопка на входе, страница знает при рендере (запрос к API с сервера,
 * кэш 5 минут) — подменить это из браузера нельзя, поэтому кнопку сверяем с
 * настоящим ответом GET /api/v1/oauth/providers стенда: есть Яндекс — есть кнопка.
 */
const PROVIDER = { name: 'yandex', clientId: 'test-client', authorizeUrl: 'https://oauth.yandex.ru/authorize', scope: 'login:email login:info login:avatar' };
const FLOW_KEY = 'gs.yandexIdFlow';

/** Ответ API с другого адреса: без CORS-заголовков (и ответа на предзапрос) браузер его не отдаст */
const fulfillCors = (page: Page, route: Route, status: number, json?: unknown) => {
    const origin = new URL(page.url()).origin;
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': 'authorization, content-type, accept-language', 'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    return json === undefined ? route.fulfill({ status, headers }) : route.fulfill({ status, headers, contentType: 'application/json', body: JSON.stringify(json) });
};

/** Поток, как его сохраняет кнопка перед уходом на Яндекс */
const saveFlow = async (page: Page, flow: Record<string, unknown>) => {
    await page.goto('/rules');
    await page.evaluate(([key, value]) => sessionStorage.setItem(key, value), [FLOW_KEY, JSON.stringify({ state: 'st4te', verifier: 'v'.repeat(64), mode: 'login', locale: 'ru', returnTo: '/rules', backTo: '/signin', createdAt: Date.now(), ...flow })]);
};

test.describe('Новый фронт: вход через Яндекс ID', () => {
    test.describe('гость', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test.beforeEach(async ({ context }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'один раз за прогон');
            await enableNewFrontend(context);
        });

        test('кнопка на входе и регистрации — ровно когда Яндекс включён на сервере', async ({ page, request }) => {
            const response = await request.get(`${API_URL}/api/v1/oauth/providers`);
            const providers = response.ok() ? ((await response.json()) as { providers?: { name: string }[] }).providers ?? [] : [];
            const enabled = providers.some((item) => item.name === 'yandex');
            for (const path of ['/signin', '/signup', '/en/signin']) {
                await page.goto(path);
                await expect(page.getByLabel('E-mail')).toBeVisible();
                const button = page.getByRole('button', { name: /Яндекс ID|Yandex ID/ });
                // Кэш страницы 5 минут: сразу после включения ключей кнопка может появиться не сразу
                await expect(button, `${path}: Яндекс ${enabled ? 'включён' : 'выключен'}`).toHaveCount(enabled ? 1 : 0);
            }
            if (!enabled) return;
            // Нажатие — уход на Яндекс с PKCE и возвратом на /oauth/yandex этого сайта
            await page.route('https://oauth.yandex.ru/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Яндекс</p>' }));
            await page.goto('/signin?next=offer&nextId=1');
            const origin = new URL(page.url()).origin;
            const [authorize] = await Promise.all([
                page.waitForRequest((req) => req.url().startsWith('https://oauth.yandex.ru/authorize')),
                page.getByRole('button', { name: 'Войти с Яндекс ID' }).click(),
            ]);
            const url = new URL(authorize.url());
            expect(url.searchParams.get('code_challenge_method')).toBe('S256');
            expect(url.searchParams.get('redirect_uri')).toBe(`${origin}/oauth/yandex`);
        });

        test('колбэк: код меняется на вход, человек возвращается туда, откуда ушёл', async ({ page }) => {
            let sent: unknown;
            await page.route('**/api/v1/oauth/yandex/login', (route) => {
                if (route.request().method() === 'POST') sent = route.request().postDataJSON();
                return fulfillCors(page, route, 200, { accessToken: 'fake-jwt', refresh_token: 'r', mercureToken: 'm', user: { id: 1, email: 'ya@example.org', roles: ['ROLE_USER'] }, isNew: false });
            });
            await saveFlow(page, { returnTo: '/rules?from=yandex' });
            await page.goto('/oauth/yandex?code=c0de&state=st4te');
            await expect(page).toHaveURL(/\/rules\?from=yandex$/, { timeout: 20_000 });
            expect(sent).toEqual({ code: 'c0de', codeVerifier: 'v'.repeat(64) });
            expect(await page.evaluate(() => JSON.parse(localStorage.getItem('token') ?? 'null'))).toBe('fake-jwt');
            expect(await page.evaluate((key) => sessionStorage.getItem(key), FLOW_KEY)).toBeNull();
            await page.evaluate(() => localStorage.clear());
        });

        test('колбэк: чужой state — без запроса к API, понятная ошибка и «Вернуться ко входу»', async ({ page }) => {
            let called = false;
            await page.route('**/api/v1/oauth/yandex/login', (route) => {
                called = true;
                return fulfillCors(page, route, 500);
            });
            await saveFlow(page, { backTo: '/signin?next=offer&nextId=1' });
            await page.goto('/oauth/yandex?code=c0de&state=forged');
            await expect(page.getByRole('heading', { name: 'Не удалось войти через Яндекс ID' })).toBeVisible();
            await expect(page.getByRole('main').getByRole('alert')).toContainText('Время на вход истекло');
            await expect(page.getByRole('link', { name: 'Вернуться ко входу' })).toHaveAttribute('href', '/signin?next=offer&nextId=1');
            // Код убран из адреса — обновление страницы не отправит его снова
            await expect(page).toHaveURL(/\/oauth\/yandex$/);
            expect(called).toBe(false);
        });

        test('колбэк на английском: в Яндексе нет почты — текст на языке сайта', async ({ page }) => {
            await page.route('**/api/v1/oauth/yandex/login', (route) => fulfillCors(page, route, 422, { error: 'no_email' }));
            await saveFlow(page, { locale: 'en', backTo: '/en/signin' });
            await page.goto('/oauth/yandex?code=c0de&state=st4te');
            await expect(page.getByRole('heading', { name: "Couldn't sign in with Yandex ID" })).toBeVisible();
            await expect(page.getByRole('main').getByRole('alert')).toContainText('Your Yandex account has no email');
            await expect(page.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute('href', '/en/signin');
        });

        test('колбэк: удалённый аккаунт — тот же текст, что у VK', async ({ page }) => {
            await page.route('**/api/v1/oauth/yandex/login', (route) => fulfillCors(page, route, 403, { error: 'account_deleted' }));
            await saveFlow(page, {});
            await page.goto('/oauth/yandex?code=c0de&state=st4te');
            await expect(page.getByRole('main').getByRole('alert')).toContainText('Пользователь был удален или не создавался');
        });

        test('страница колбэка не индексируется', async ({ page }) => {
            await page.goto('/oauth/yandex');
            await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute('content', /noindex/);
        });

        test('медленная сеть: на входе ничего не прыгает, пока грузится страница', async ({ page, context }) => {
            test.setTimeout(120_000);
            const cdp = await context.newCDPSession(page);
            await cdp.send('Network.enable');
            await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 50 * 1024, uploadThroughput: 20 * 1024 });
            await page.goto('/signin', { waitUntil: 'commit', timeout: 90_000 });
            await expect(page.getByLabel('E-mail')).toBeVisible({ timeout: 60_000 });
            // Включён ли Яндекс, известно уже в HTML: кнопка не появляется и не пропадает после загрузки скриптов
            const yandex = page.getByRole('button', { name: 'Войти с Яндекс ID' });
            const countBefore = await yandex.count();
            const boxBefore = countBefore ? await yandex.boundingBox() : null;
            await page.waitForLoadState('load', { timeout: 90_000 });
            await page.waitForTimeout(1500);
            expect(await yandex.count()).toBe(countBefore);
            if (boxBefore) expect((await yandex.boundingBox())?.height).toBe(boxBefore.height);
        });
    });

    test.describe('настройки профиля', () => {
        test.beforeEach(async ({ context }, testInfo) => {
            test.skip(testInfo.project.name !== 'vol', 'кабинет волонтёра');
            await enableNewFrontend(context);
        });

        test('провайдер выключен — блока нет', async ({ page }) => {
            await page.route('**/api/v1/oauth/accounts', (route) => fulfillCors(page, route, 200, { accounts: [] }));
            await page.goto('/profile/reset-password');
            await expect(page.getByRole('button', { name: 'Сохранить' })).toBeVisible({ timeout: 20_000 });
            await expect(page.getByRole('heading', { name: 'Вход через Яндекс ID' })).toHaveCount(0);
        });

        test('привязан, но пароля нет — «Отвязать» неактивна с пояснением', async ({ page }) => {
            await page.route('**/api/v1/oauth/accounts', (route) => fulfillCors(page, route, 200, { accounts: [{ provider: 'yandex', linked: true, canUnlink: false }] }));
            await page.route('**/api/v1/oauth/providers', (route) => fulfillCors(page, route, 200, { providers: [PROVIDER] }));
            await page.goto('/profile/reset-password');
            const block = page.getByRole('region', { name: 'Вход через Яндекс ID' });
            await expect(block).toBeVisible({ timeout: 20_000 });
            await expect(block.getByRole('button', { name: 'Отвязать' })).toBeDisabled();
            await expect(block).toContainText('Сначала задайте пароль');
        });

        test('привязан и можно отвязать — DELETE и «не привязан»', async ({ page }) => {
            let deleted = false;
            await page.route('**/api/v1/oauth/accounts', (route) => fulfillCors(page, route, 200, { accounts: [{ provider: 'yandex', linked: true, canUnlink: true }] }));
            await page.route('**/api/v1/oauth/providers', (route) => fulfillCors(page, route, 200, { providers: [PROVIDER] }));
            await page.route('**/api/v1/oauth/yandex/link', (route) => {
                if (route.request().method() === 'DELETE') deleted = true;
                return fulfillCors(page, route, 204);
            });
            await page.goto('/profile/reset-password');
            const block = page.getByRole('region', { name: 'Вход через Яндекс ID' });
            await block.getByRole('button', { name: 'Отвязать' }).click();
            await expect(page.getByRole('status').filter({ hasText: 'Яндекс ID отвязан' })).toBeVisible();
            await expect(block.getByRole('button', { name: 'Привязать' })).toBeVisible();
            expect(deleted).toBe(true);
        });

        test('«Привязать» — уход на Яндекс в режиме привязки, после возврата — POST …/link', async ({ page }) => {
            await page.route('**/api/v1/oauth/accounts', (route) => fulfillCors(page, route, 200, { accounts: [{ provider: 'yandex', linked: false, canUnlink: true }] }));
            await page.route('**/api/v1/oauth/providers', (route) => fulfillCors(page, route, 200, { providers: [PROVIDER] }));
            await page.route('https://oauth.yandex.ru/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: '<p>Яндекс</p>' }));
            await page.goto('/profile/reset-password');
            await page.getByRole('region', { name: 'Вход через Яндекс ID' }).getByRole('button', { name: 'Привязать' }).click();
            await expect(page).toHaveURL(/^https:\/\/oauth\.yandex\.ru\/authorize/);
            const url = new URL(page.url());
            expect(url.searchParams.get('client_id')).toBe('test-client');
            expect(url.searchParams.get('redirect_uri')).toMatch(/\/oauth\/yandex$/);
            const state = url.searchParams.get('state') ?? '';

            // Яндекс вернул код: страница-колбэк понимает, что это привязка
            let linked: unknown;
            await page.route('**/api/v1/oauth/yandex/link', (route) => {
                if (route.request().method() === 'POST') linked = route.request().postDataJSON();
                return fulfillCors(page, route, 200, { provider: 'yandex', linked: true });
            });
            await page.unroute('**/api/v1/oauth/accounts');
            await page.route('**/api/v1/oauth/accounts', (route) => fulfillCors(page, route, 200, { accounts: [{ provider: 'yandex', linked: true, canUnlink: true }] }));
            const origin = new URL(url.searchParams.get('redirect_uri') ?? '').origin;
            await page.goto(`${origin}/oauth/yandex?code=c0de&state=${state}`);
            await expect(page).toHaveURL(/\/profile\/reset-password$/, { timeout: 20_000 });
            expect(linked).toMatchObject({ code: 'c0de' });
            await expect(page.getByRole('status').filter({ hasText: 'Яндекс ID привязан' })).toBeVisible();
        });
    });
});

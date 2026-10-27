import { test, expect, request } from '@playwright/test';
import { API_URL } from '../config';

/**
 * Живая проверка полного платёжного пути на стейдже (row 95, row 106-соседние
 * пункты про членство) — не мок, реальный тестовый платёж через ЮКасса
 * (staging сконфигурирован на YOOKASSA_SECRET_KEY=test_..., деньги не
 * списываются, "demo store will receive the payment").
 *
 * Архитектура теста: регистрация/логин/чекаут/вебхук/проверка членства идут
 * напрямую через API-контекст (`api`); браузер (`page`) используется только
 * для самого чекаута ЮКассы (yoomoney.ru).
 *
 * Вебхук: тестовый магазин ЮКассы шлёт уведомления на URL, настроенный в его
 * кабинете, а не на стейдж, поэтому тест сам реплеит нотификацию. Бизнес-логика
 * вебхука (переспрос ЮКасса API, идемпотентность, активация Membership) при
 * этом не мокается.
 *
 * Оба ограничения — системные особенности стейджа, не баги тестируемого кода.
 */
test.describe('Оплата членства — полный путь на стейдже', () => {
    test('чекаут → тестовая оплата ЮКасса → (replay вебхука) → членство ACTIVE', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'vol', 'один настоящий платёж на прогон — не дублировать по проектам');
        test.setTimeout(120_000);
        const api = await request.newContext({
            baseURL: API_URL,
            ignoreHTTPSErrors: true,
        });

        // Свежий одноразовый пользователь — чтобы не зависеть от состояния
        // членства общих e2e-фикстур (vol@test.com и т.д.) между прогонами.
        const email = `e2e-payment-${Date.now()}@test.local`;
        const password = 'E2ePayment2026!';

        // Служебный эндпоинт стейджа (гейт E2E_TESTING_ENABLED): сразу
        // подтверждённый пользователь, без лимита регистраций.
        const createResp = await api.post('/api/test/create-user', { data: { email, password } });
        expect(createResp.ok(), await createResp.text()).toBeTruthy();

        const loginResp = await api.post('/api/v1/token', { data: { email, password } });
        expect(loginResp.ok(), await loginResp.text()).toBeTruthy();
        const { accessToken } = await loginResp.json();
        const authHeader = { Authorization: `Bearer ${accessToken}` };

        // Тот же запрос, что PaymentPage.tsx делает через
        // useCheckoutMembershipMutation() — воспроизводим напрямую, минуя SPA.
        const checkoutResp = await api.post('/api/v1/membership/checkout', {
            data: { tariffCode: 'volunteer_990' },
            headers: authHeader,
        });
        expect(checkoutResp.ok(), await checkoutResp.text()).toBeTruthy();
        const { paymentUrl } = await checkoutResp.json();
        expect(paymentUrl).toBeTruthy();

        await page.goto(paymentUrl);
        await page.waitForURL(/yoomoney\.ru\/checkout/, { timeout: 15_000 });
        await expect(page.locator('[data-qa="notification-informer"]')).toBeVisible({ timeout: 10_000 });

        const orderId = new URL(page.url()).searchParams.get('orderId');
        expect(orderId).toBeTruthy();

        // Оплата тестовой картой ЮKassa (деньги не списываются):
        // https://yookassa.ru/developers/payment-acceptance/testing/test-bank-card
        await page.getByText(/Bank card|Банковская карта/).first().click();
        await page.locator('input[name="card-number"]').pressSequentially('5555555555554444', { delay: 20 });
        await page.locator('input[name="expiry-month"]').pressSequentially('12', { delay: 20 });
        await page.locator('input[name="expiry-year"]').pressSequentially('30', { delay: 20 });
        await page.locator('input[name="security-code"]').pressSequentially('123', { delay: 20 });
        await page.locator('button[type="submit"]').click();
        // Тестовая ЮKassa иногда отвечает медленно — 30 с иногда не хватало.
        await page.waitForURL(/checkout\/payments\/v2\/success/, { timeout: 60_000 });

        // Реплеим уведомление сами (см. коммент в начале файла).
        const notifyResp = await api.post('/api/v1/payments/yookassa/notification', {
            data: {
                type: 'notification',
                event: 'payment.succeeded',
                object: { id: orderId, status: 'succeeded' },
            },
        });
        expect(notifyResp.ok(), await notifyResp.text()).toBeTruthy();

        const membershipResp = await api.get('/api/v1/membership/current', { headers: authHeader });
        const membership = await membershipResp.json();
        expect(membership.status).toBe('ACTIVE');
        expect(membership.tariff?.code).toBe('volunteer_990');

        await api.dispose();
    });
});

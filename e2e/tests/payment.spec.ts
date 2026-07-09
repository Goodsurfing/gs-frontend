import { test, expect, request } from '@playwright/test';
import { API_URL, IAP_TOKEN } from '../config';

/**
 * Живая проверка полного платёжного пути на стейдже (row 95, row 106-соседние
 * пункты про членство) — не мок, реальный тестовый платёж через ЮКасса
 * (staging сконфигурирован на YOOKASSA_SECRET_KEY=test_..., деньги не
 * списываются, "demo store will receive the payment").
 *
 * ВАЖНО про архитектуру теста: регистрация/логин/чекаут/вебхук/проверка
 * членства идут напрямую через API-контекст (`api`), а не через открытие
 * SPA на staging.goodsurfing.org. Причина — IAP-bypass токен нужно слать
 * заголовком (Authorization или X-Forwarded-Authorization), а любой
 * нестандартный заголовок на кросс-origin запрос (staging.goodsurfing.org →
 * api-staging.goodsurfing.org) заставляет браузер слать CORS-preflight
 * (OPTIONS), который сам перехватывается IAP и не проходит — реальные
 * авторизованные запросы SPA с любым из этих заголовков падают с CORS-
 * ошибкой ещё до попытки авторизации. `request.newContext()` — обычный
 * HTTP-клиент Playwright, не браузерный fetch, на него CORS не действует,
 * поэтому весь путь до реального чекаута идёт через него. Браузер (`page`)
 * используется только для навигации на сам чекаут ЮКассы (yoomoney.ru —
 * сторонний домен, IAP там нет вообще).
 *
 * ВАЖНО про вебхук: staging закрыт Yandex IAP на уровне инфраструктуры
 * (перед Traefik), и это гейтит ВООБЩЕ ВСЕ входящие запросы на
 * api-staging.goodsurfing.org — включая вебхук ЮКасса. Реальные серверы
 * ЮКассы не могут пройти IAP и получают 302 на страницу логина Яндекса
 * вместо ответа от Symfony. Проверено напрямую: POST на
 * /api/v1/payments/yookassa/notification без IAP-bypass-заголовка → 302 на
 * /auth/login, не 200. Значит на стейдже членство НИКОГДА не активируется
 * автоматически после оплаты — тест поэтому вручную реплеит нотификацию с
 * IAP-bypass, эмулируя то, что сделали бы реальные серверы ЮКассы, если бы
 * могли достучаться. Сама бизнес-логика вебхука (верификация через переспрос
 * ЮКасса API, идемпотентность, активация Membership) от этого не мокается —
 * только обходится инфраструктурная блокировка доставки.
 *
 * Оба ограничения — системные особенности стейджа, не баги тестируемого кода.
 */
test.describe('Оплата членства — полный путь на стейдже', () => {
    test('чекаут → тестовая оплата ЮКасса → (replay вебхука) → членство ACTIVE', async ({ page }) => {
        const api = await request.newContext({
            baseURL: API_URL,
            extraHTTPHeaders: IAP_TOKEN ? { 'X-Forwarded-Authorization': `Bearer ${IAP_TOKEN}` } : {},
            ignoreHTTPSErrors: true,
        });

        // Свежий одноразовый пользователь — чтобы не зависеть от состояния
        // членства общих e2e-фикстур (vol@test.com и т.д.) между прогонами.
        const email = `e2e-payment-${Date.now()}@test.local`;
        const password = 'E2ePayment2026!';

        const registerResp = await api.post('/api/v1/users', {
            data: {
                email, plainPassword: password, locale: 'ru', isActive: true,
            },
        });
        expect(registerResp.ok(), await registerResp.text()).toBeTruthy();

        // /api/v1/token требует is_verified=true, а реального письма в e2e
        // нет — подтверждаем через служебный тест-эндпоинт (тот же гейт
        // E2E_TESTING_ENABLED, что у /api/test/reset).
        const verifyResp = await api.post('/api/test/verify-email', { data: { email } });
        expect(verifyResp.ok(), await verifyResp.text()).toBeTruthy();

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

        // playwright.config.ts шлёт Authorization: Bearer <IAP-токен> глобально
        // для всех запросов контекста (нужно для обхода IAP на staging) — но
        // тот же заголовок летит и на сторонние домены. yoomoney.ru не ждёт
        // Authorization на кросс-origin запросах к своим статикам и роняет
        // CORS-preflight на них (страница остаётся пустой). Чекаут ЮKassa не
        // за IAP, так что заголовок здесь не нужен — снимаем его перед переходом.
        await page.context().setExtraHTTPHeaders({});
        await page.goto(paymentUrl);
        await page.waitForURL(/yoomoney\.ru\/checkout/, { timeout: 15_000 });
        await expect(page.locator('[data-qa="notification-informer"]')).toBeVisible({ timeout: 10_000 });

        const orderId = new URL(page.url()).searchParams.get('orderId');
        expect(orderId).toBeTruthy();

        // Виджет ЮKassa на этот заказ выдаёт тестовый кошелёк test.wallet —
        // выбираем его как способ оплаты и подтверждаем.
        await page.locator('[data-qa="pay-wallet"]').click();
        await page.locator('[data-qa="confirm-payment-button"]').click();
        await page.waitForURL(/checkout\/payments\/v2\/success/, { timeout: 15_000 });

        // Реальная доставка вебхука на стейдж заблокирована IAP (см. коммент
        // в начале файла) — реплеим её сами тем же способом, каким это
        // делают все остальные ручные проверки на стейдже в этой сессии.
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

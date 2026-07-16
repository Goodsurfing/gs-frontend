import { test, expect, request } from '@playwright/test';
import { API_URL, IAP_TOKEN } from '../config';

/**
 * Живая проверка полного платёжного пути на стейдже через Paygine (row 124) —
 * не мок, реальный тестовый платёж через test.paygine.com настоящей тестовой
 * картой Paygine (сектор 7659, PAYMENT_PROVIDER=paygine на стейдже).
 *
 * Архитектура теста — тот же паттерн, что payment.spec.ts (ЮКасса): регистрация/
 * логин/чекаут через API-контекст (`api`), браузер (`page`) только для самого
 * хостед-пейджа Paygine. См. комментарий в payment.spec.ts про то, почему
 * нестандартные auth-заголовки на кросс-origin запросы к SPA не работают.
 *
 * В отличие от ЮКассы — вебхук Paygine НЕ нужно реплеить вручную: маршрут
 * /api/v1/payments/paygine/callback/{id} не за Yandex IAP (проверено живьём
 * 16.07 — реальный сервер Paygine достучался и обновил Payment без какого-либо
 * bypass с нашей стороны), поэтому тест просто поллит членство после оплаты.
 */
test.describe('Оплата членства — полный путь на стейдже (Paygine)', () => {
    test('чекаут → тестовая оплата Paygine → членство ACTIVE', async ({ page }) => {
        const api = await request.newContext({
            baseURL: API_URL,
            extraHTTPHeaders: IAP_TOKEN ? { 'X-Forwarded-Authorization': `Bearer ${IAP_TOKEN}` } : {},
            ignoreHTTPSErrors: true,
        });

        const email = `e2e-paygine-${Date.now()}@test.local`;
        const password = 'E2ePaygine2026!';

        const registerResp = await api.post('/api/v1/users', {
            data: {
                email, plainPassword: password, locale: 'ru', isActive: true,
            },
        });
        expect(registerResp.ok(), await registerResp.text()).toBeTruthy();

        const verifyResp = await api.post('/api/test/verify-email', { data: { email } });
        expect(verifyResp.ok(), await verifyResp.text()).toBeTruthy();

        const loginResp = await api.post('/api/v1/token', { data: { email, password } });
        expect(loginResp.ok(), await loginResp.text()).toBeTruthy();
        const { accessToken } = await loginResp.json();
        const authHeader = { Authorization: `Bearer ${accessToken}` };

        const checkoutResp = await api.post('/api/v1/membership/checkout', {
            data: { tariffCode: 'volunteer_990' },
            headers: authHeader,
        });
        expect(checkoutResp.ok(), await checkoutResp.text()).toBeTruthy();
        const { paymentUrl } = await checkoutResp.json();
        expect(paymentUrl).toBeTruthy();

        // Тот же CORS/IAP-заголовок конфликт, что у yoomoney.ru в payment.spec.ts —
        // снимаем перед переходом на сторонний домен test.paygine.com.
        await page.context().setExtraHTTPHeaders({});
        await page.goto(paymentUrl);
        await page.waitForLoadState('networkidle');

        await page.getByTestId('toggle:card').click();
        await page.getByTestId('card:pan-input').fill('4986290000000080');
        await page.getByTestId('card:date-input').fill('0825');
        await page.getByTestId('card:code-input').fill('721');
        await page.locator('button:has-text("Оплатить")').click();

        // Реальный вебхук Paygine прилетает асинхронно — поллим Payment.
        await expect(async () => {
            const membershipResp = await api.get('/api/v1/membership/current', { headers: authHeader });
            const membership = await membershipResp.json();
            expect(membership.status).toBe('ACTIVE');
            expect(membership.tariff?.code).toBe('volunteer_990');
        }).toPass({ timeout: 20_000 });

        await api.dispose();
    });
});

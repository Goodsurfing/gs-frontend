import { APIRequestContext, expect, Page } from '@playwright/test';

/**
 * Оплата тестовой картой ЮKassa (деньги не списываются):
 * https://yookassa.ru/developers/payment-acceptance/testing/test-bank-card
 * Страница ЮKassa должна быть уже открыта (после чекаута). Возвращает orderId.
 *
 * Карта — «Мир» 2200 0000 0000 0004 с проверкой 3-D Secure: Mastercard 5555…4444
 * с 25.11.2026 в тестовом магазине всегда отвечает «технический сбой».
 */
const TEST_CARD = '2200000000000004';
export const payWithTestCard = async (page: Page): Promise<string> => {
    await page.waitForURL(/yoomoney\.ru\/checkout/, { timeout: 30_000 });
    await expect(page.locator('[data-qa="notification-informer"]')).toBeVisible({ timeout: 15_000 });
    const orderId = new URL(page.url()).searchParams.get('orderId');
    expect(orderId, 'нет orderId в адресе ЮKassa').toBeTruthy();

    await page.getByText(/Bank card|Банковская карта/).first().click();
    // Форма ЮKassa с масками иногда теряет символы при быстром вводе
    // (28.10 в CVC дошла одна цифра из трёх). Поэтому каждое поле вводим
    // заново, пока значение не совпадёт.
    const typeInto = async (name: string, value: string) => {
        const input = page.locator(`input[name="${name}"]`);
        await expect(async () => {
            await input.fill('');
            await input.pressSequentially(value, { delay: 40 });
            expect((await input.inputValue()).replace(/\D/g, '')).toBe(value);
        }).toPass({ timeout: 15_000 });
    };
    await typeInto('card-number', TEST_CARD);
    await typeInto('expiry-month', '12');
    await typeInto('expiry-year', '30');
    await typeInto('security-code', '123');
    await page.locator('button[type="submit"]').click();

    // Тестовая страница 3-D Secure ЮKassa: «Card authentication», код — любое число
    await page.waitForURL(/yookassa\.ru\/sandbox\/bank-card\/3ds/, { timeout: 30_000 });
    await page.locator('input[name="answer"]').fill('123');
    await page.getByRole('button', { name: 'Confirm' }).click();
    // Тестовая ЮKassa иногда отвечает медленно
    await page.waitForURL(/checkout\/payments\/v2\/success|goodsurfing\.org/, { timeout: 60_000 });

    return orderId as string;
};

/**
 * Тестовый магазин ЮKassa шлёт уведомления на адрес из своего кабинета, а не
 * на стейдж, поэтому тест сам повторяет уведомление. Бизнес-логика вебхука
 * (перезапрос статуса в ЮKassa, идемпотентность, активация) не мокается.
 */
export const replayPaymentSucceeded = async (api: APIRequestContext, orderId: string) => {
    const response = await api.post('/api/v1/payments/yookassa/notification', {
        data: { type: 'notification', event: 'payment.succeeded', object: { id: orderId, status: 'succeeded' } },
    });
    expect(response.ok(), await response.text()).toBeTruthy();
};

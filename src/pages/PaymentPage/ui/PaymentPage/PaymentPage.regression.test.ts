import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 95 ("Не работает модуль оплаты" — пункт 15
 * "Правки сайт ГС 2.0 от 23.06.2026": "После нажатия на любую из кнопок
 * оплаты, просто возвращает в начало страницы").
 *
 * Бэкенд-чекаут (POST /api/v1/membership/checkout) при живой проверке на
 * стейдже отдаёт валидный paymentUrl без ошибок — сам чекаут исправен.
 * Но при HTTP 409 (у пользователя уже есть ACTIVE членство) фронт молча
 * делал navigate() на страницу членства без единого сообщения — именно
 * это выглядит как "нажал на оплату — ничего не произошло, вернуло в
 * начало". Теперь показывается явное сообщение через errorMessage.
 *
 * Компонент слишком завязан на роутинг/auth/RTK Query для полного
 * рендер-теста — проверяем исходник.
 */
describe("PaymentPage 409-handling (regress-guard)", () => {
    it("на 409 показывает сообщение вместо молчаливого navigate", () => {
        const source = readFileSync(join(__dirname, "PaymentPage.tsx"), "utf-8");

        const catchBlockMatch = source.match(
            /err\.status === 409\) \{([\s\S]*?)\}/,
        );
        expect(catchBlockMatch).not.toBeNull();
        expect(catchBlockMatch![1]).toMatch(/setErrorMessage/);
        expect(catchBlockMatch![1]).not.toMatch(/navigate\(/);
    });
});

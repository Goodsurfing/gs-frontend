import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 116: непрочитанные чаты "моргали" и пропадали из
 * видимой области при активной переписке — на каждое SSE-сообщение (в любом
 * чате) дёргался полный fetchChats() (сеть + пересортировка всего списка).
 * Колбэк на входящее сообщение должен использовать точечное обновление
 * (applyIncomingMessage), а не fetchChats.
 *
 * Компонент слишком завязан на контекст (MessengerProvider, SSE) для
 * полного рендер-теста — проверяем исходник.
 */
describe("MessengerList on-message wiring (regress-guard)", () => {
    it("registerOnMessageCallback использует applyIncomingMessage, а не fetchChats", () => {
        const source = readFileSync(join(__dirname, "MessengerList.tsx"), "utf-8");

        const onMessageBlockMatch = source.match(
            /registerOnMessageCallback\(\(msg\) => \{([\s\S]*?)\}\);/,
        );
        expect(onMessageBlockMatch).not.toBeNull();
        expect(onMessageBlockMatch![1]).toMatch(/applyIncomingMessage/);
        expect(onMessageBlockMatch![1]).not.toMatch(/fetchChats\(\)/);
    });
});

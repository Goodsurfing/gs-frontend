import { describe, it, expect } from "vitest";
import { ChatType } from "@/entities/Messenger";
import { ProfileById } from "@/entities/Profile";
import { getEffectiveCompanion } from "./getEffectiveCompanion";

const chatData = {
    otherParticipants: [{ id: "1", firstName: "Иван", lastName: "Иванов" }],
} as unknown as ChatType;

const companionData = {
    id: "1",
    firstName: "Пётр",
    lastName: "Петров",
} as unknown as ProfileById;

/**
 * Регресс-guard для rows 49/50: до загрузки companionData (отдельный
 * ленивый запрос) в чате показывалось «Анонимный пользователь» и не было
 * аватара. Фикс: chatData.otherParticipants[0] используется как фолбэк.
 * PR gs-frontend#321.
 */
describe("getEffectiveCompanion", () => {
    it("возвращает companionData, когда он уже загружен", () => {
        expect(getEffectiveCompanion(companionData, chatData)).toBe(companionData);
    });

    it("падает обратно на chatData.otherParticipants[0], пока companionData не загружен", () => {
        expect(getEffectiveCompanion(undefined, chatData)).toBe(chatData.otherParticipants[0]);
    });

    it("возвращает undefined, если нет ни companionData, ни chatData", () => {
        expect(getEffectiveCompanion(undefined, undefined)).toBeUndefined();
    });
});

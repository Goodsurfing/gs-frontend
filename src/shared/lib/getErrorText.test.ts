import { describe, it, expect } from "vitest";
import { getErrorText } from "./getErrorText";

/**
 * Регресс-guard для row 36: при входе через ВК страница смены пароля
 * выдавала заглушку «Произошла ошибка» вместо реальной причины (пароль
 * короче 6 символов и т.п.). Фикс: getErrorText научился разбирать
 * формат валидационных ошибок { errors: [...] } от бэкенда.
 * PR gs-frontend#320.
 */
describe("getErrorText", () => {
    it("извлекает текст из формата валидационных ошибок { errors: [...] }", () => {
        const error = { data: { errors: ["Пароль слишком короткий"] } };

        expect(getErrorText(error)).toBe("Пароль слишком короткий");
    });

    it("объединяет несколько ошибок через точку с пробелом", () => {
        const error = { data: { errors: ["Ошибка 1", "Ошибка 2"] } };

        expect(getErrorText(error)).toBe("Ошибка 1. Ошибка 2");
    });

    it("не подменяет заглушкой «Произошла ошибка», когда есть errors", () => {
        const error = { data: { errors: ["Пароль слишком короткий"] } };

        expect(getErrorText(error)).not.toBe("Произошла неизвестная ошибка.");
    });
});

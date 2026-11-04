import { describe, expect, it } from "vitest";

import { errorText } from "../api";

describe("текст ошибки API админки", () => {
    it("берёт title/detail ответа", () => {
        expect(errorText({ title: "Нет такой записи" }, 404)).toBe("Нет такой записи");
    });

    it("собирает ошибки проверки полей", () => {
        expect(errorText({ color: "This value should not be blank." }, 400)).toBe("color: This value should not be blank.");
    });

    it("без тела — код ответа", () => {
        expect(errorText(null, 500)).toBe("Ошибка 500");
        expect(errorText(null, 403)).toBe("Нет доступа");
    });
});

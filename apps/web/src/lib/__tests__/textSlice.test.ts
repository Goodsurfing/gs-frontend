import { describe, expect, it } from "vitest";

import { categoryName } from "../categories";
import { firstChar, takeChars, textSlice } from "../textSlice";

describe("textSlice", () => {
    it("обрезает как старый фронт: length−1 символов и «..»", () => {
        expect(textSlice("Зима, сноубординг, друзья - Шерегеш", 30, "")).toBe("Зима, сноубординг, друзья - Ш..");
        expect(textSlice("Коротко", 30, "")).toBe("Коротко");
    });

    it("пустое — запасной текст", () => {
        expect(textSlice("", 30, "Без адреса")).toBe("Без адреса");
        expect(textSlice(null, 30, "Без адреса")).toBe("Без адреса");
    });
});

describe("categoryName", () => {
    const t = (key: string) => `[${key}]`;

    it("известная категория — через словарь, пробелы по краям не мешают", () => {
        expect(categoryName("Оплачиваемая работа ", t)).toBe("[category-offer.Оплачиваемая работа]");
    });

    it("неизвестная — как есть, пустая — undefined", () => {
        expect(categoryName("Новая категория", t)).toBe("Новая категория");
        expect(categoryName(undefined, t)).toBeUndefined();
    });
});

describe("textSlice и эмодзи", () => {
    it("не режет эмодзи пополам (иначе ошибка гидратации React #418)", () => {
        const text = "Волонтёрство у моря 🌊🌊 и ещё текст";
        for (let length = 3; length < text.length; length++) {
            const cut = textSlice(text, length, "");
            expect(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(cut), `length ${length}: ${cut}`).toBe(false);
        }
    });

    it("takeChars — тоже по символам", () => {
        expect(takeChars("Ан🫶на Петрова", 3)).toBe("Ан🫶");
    });
});

describe("firstChar", () => {
    it("эмодзи в начале имени — целиком (инициал в аватаре)", () => {
        expect(firstChar("🌿Мария")).toBe("🌿");
        expect(firstChar("Мария")).toBe("М");
        expect(firstChar("")).toBe("");
    });
});

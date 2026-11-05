import { describe, expect, it } from "vitest";

import { whyText } from "../recommendations";

const labels = { title: "Почему подходит:", category: "ваше направление «{value}»", skill: "ваш навык «{value}»", language: "язык: {value}", rating: "рейтинг {value}", top: "Топ-хост" };

describe("почему подходит", () => {
    it("подписи причин", () => {
        expect(whyText({ type: "category", value: "Экология" }, labels, "ru")).toBe("ваше направление «Экология»");
        expect(whyText({ type: "skill", value: "Готовка" }, labels, "ru")).toBe("ваш навык «Готовка»");
        expect(whyText({ type: "language", value: "en" }, labels, "ru")).toBe("язык: английский");
        expect(whyText({ type: "rating", value: "4.8" }, labels, "ru")).toBe("рейтинг 4,8");
        expect(whyText({ type: "top", value: "" }, labels, "ru")).toBe("Топ-хост");
        expect(whyText({ type: "unknown", value: "x" }, labels, "ru")).toBe("");
    });
});

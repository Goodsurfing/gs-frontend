import { describe, expect, it } from "vitest";

import { displayName } from "../AccountArea";

describe("Имя в шапке", () => {
    it("имя, если есть", () => {
        expect(displayName({ firstName: "Роман", email: "romanlinkoff@gmail.com" })).toBe("Роман");
    });

    it("без имени — начало почты без «@…» (раньше было обрезанное «romanlinkoff@»)", () => {
        expect(displayName({ firstName: "", email: "romanlinkoff@gmail.com" })).toBe("romanlinkoff");
        expect(displayName({ firstName: null, email: "a@b.c" })).toBe("a");
    });

    it("очень длинное — не больше 40 знаков (по ширине дальше режет CSS)", () => {
        expect(displayName({ firstName: "Я".repeat(60) }).length).toBe(40);
    });
});

import { describe, expect, it } from "vitest";

import { startState } from "../startSteps";

describe("«С чего начать»", () => {
    it("новичок без ничего — все три шага, никуда не уводим", () => {
        expect(startState({})).toEqual({ redirect: null, done: { apply: false, intro: false, directions: false } });
    });
    it("имя без фото — шаг «имя и фото» не сделан", () => {
        expect(startState({ firstName: "Анна", favoriteCategories: [3] })).toEqual({ redirect: null, done: { apply: false, intro: false, directions: true } });
    });
    it("организатор — на свой рабочий стол; кто уже откликался — на рабочий стол волонтёра", () => {
        expect(startState({ hostId: "h1" }).redirect).toBe("host");
        expect(startState({ volunteer: { id: 1 } }).redirect).toBe("volunteer");
    });
});

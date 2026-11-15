import { describe, expect, it } from "vitest";

import { isTemplatePath } from "@/proxy";

describe("isTemplatePath — шаблон ссылки вместо id отдаётся 404", () => {
    it("шаблоны, в том числе закодированные", () => {
        expect(isTemplatePath("/academy-course/%7Bid%7D")).toBe(true);
        expect(isTemplatePath("/en/offers/{id}")).toBe(true);
        expect(isTemplatePath("/volunteers/%7bid%7d")).toBe(true);
    });

    it("обычные адреса не трогает", () => {
        expect(isTemplatePath("/offers/4706")).toBe(false);
        expect(isTemplatePath("/academy-course/1f1076da-44be-61ee-91b8-67c068d01c6c")).toBe(false);
        expect(isTemplatePath("/es/organizations/019dbeab-5236-7707-840e-f912706445a6")).toBe(false);
        expect(isTemplatePath("/")).toBe(false);
    });
});

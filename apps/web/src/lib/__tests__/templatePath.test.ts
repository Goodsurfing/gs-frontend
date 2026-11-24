import { describe, expect, it } from "vitest";

import { isMalformedPath, isMissingDynamicPath, isTemplatePath } from "@/proxy";

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

describe("isMalformedPath — испорченная кодировка в адресе отдаётся 400", () => {
    it("неверные последовательности", () => {
        expect(isMalformedPath("/..%C0%AF..%C0%AF.env")).toBe(true);
        expect(isMalformedPath("/offers/%E0%A4%A")).toBe(true);
        expect(isMalformedPath("/%ZZ")).toBe(true);
    });

    it("обычные и кириллические адреса не трогает", () => {
        expect(isMalformedPath("/offers/4706")).toBe(false);
        expect(isMalformedPath("/blog/%D0%B7%D0%B8%D0%BC%D0%B0")).toBe(false);
        expect(isMalformedPath("/")).toBe(false);
    });
});

describe("isMissingDynamicPath — сбор и курс с id не того вида отдаются 404 (GS-302)", () => {
    it("id не UUID", () => {
        expect(isMissingDynamicPath("/fundraise/99999999")).toBe(true);
        expect(isMissingDynamicPath("/en/fundraise/abc")).toBe(true);
        expect(isMissingDynamicPath("/academy-course/99999999")).toBe(true);
        expect(isMissingDynamicPath("/es/academy-course/99999999/")).toBe(true);
    });

    it("настоящие id и другие страницы не трогает", () => {
        expect(isMissingDynamicPath("/fundraise/019fe737-96c4-77ef-9b2a-1154eff06fea")).toBe(false);
        expect(isMissingDynamicPath("/academy-course/1f1076da-44be-61ee-91b8-67c068d01c6c")).toBe(false);
        expect(isMissingDynamicPath("/fundraise")).toBe(false);
        expect(isMissingDynamicPath("/fundraise/welcome/019fe737-96c4-77ef-9b2a-1154eff06fea")).toBe(false);
        expect(isMissingDynamicPath("/offers/99999999")).toBe(false);
        expect(isMissingDynamicPath("/academy-main")).toBe(false);
    });
});

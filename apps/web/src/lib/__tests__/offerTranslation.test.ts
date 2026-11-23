import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { localizeCard } = await import("@/lib/offers");
const { localizedDescription } = await import("@/lib/offer");

describe("переводы вакансий (GS-227)", () => {
    it("карточка берёт перевод названия и описания, без перевода — как есть", () => {
        expect(localizeCard({ title: "Ферма", shortDescription: "Коротко", translatedTitle: "Farm", translatedShortDescription: "Short" }))
            .toMatchObject({ title: "Farm", shortDescription: "Short" });
        expect(localizeCard({ title: "Ферма", shortDescription: "Коротко", translatedTitle: null })).toMatchObject({ title: "Ферма", shortDescription: "Коротко" });
        expect(localizeCard({ title: "Ферма", shortDescription: "Коротко", translatedTitle: "Farm", translatedShortDescription: null }))
            .toMatchObject({ title: "Farm", shortDescription: "Коротко" });
    });

    it("страница вакансии: перевод вместо текстов, оригинал — для «Показать оригинал»", () => {
        const offer = {
            description: { title: "Ферма", shortDescription: "Коротко", description: "Подробно", categories: [] },
            translation: { locale: "en", title: "Farm", shortDescription: "Short", description: "Long", source: "auto", outdated: false },
        } as never;
        const { description, original } = localizedDescription(offer);
        expect(description).toMatchObject({ title: "Farm", shortDescription: "Short", description: "Long" });
        expect(original).toEqual({ title: "Ферма", shortDescription: "Коротко", description: "Подробно" });

        const russian = localizedDescription({ description: { title: "Ферма" }, translation: null } as never);
        expect(russian.original).toBeNull();
        expect(russian.description).toMatchObject({ title: "Ферма" });
    });
});

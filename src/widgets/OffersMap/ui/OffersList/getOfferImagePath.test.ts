import { describe, it, expect } from "vitest";
import { getOfferImagePath } from "./getOfferImagePath";

/**
 * Регресс-тест для PR gs-frontend#337/#338 (коммит c2ce9312): картинки
 * в списке /offers-map не отображались для старых (легаси) вакансий без
 * thumbnails — нужен фолбэк на contentUrl оригинала.
 */
describe("getOfferImagePath", () => {
    it("использует thumbnails.medium, когда он есть", () => {
        const image = {
            id: "1",
            contentUrl: "https://cdn.example/original.jpg",
            thumbnails: { large: "", medium: "https://cdn.example/medium.jpg", small: "" },
        };

        expect(getOfferImagePath(image)).toBe("https://cdn.example/medium.jpg");
    });

    it("падает на contentUrl для легаси-вакансий без thumbnails", () => {
        const image = { id: "1", contentUrl: "https://cdn.example/legacy-original.jpg" };

        expect(getOfferImagePath(image)).toBe("https://cdn.example/legacy-original.jpg");
    });

    it("возвращает undefined, если у вакансии вообще нет картинки", () => {
        expect(getOfferImagePath(null)).toBeUndefined();
        expect(getOfferImagePath(undefined)).toBeUndefined();
    });
});

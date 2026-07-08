import { describe, it, expect } from "vitest";
import { galleryUrls } from "./OfferPersonalCard";
import { Image } from "@/types/media";

/**
 * Регресс-тест для PR gs-frontend#337/#338 (коммит c2ce9312): галерея вакансии
 * отдавала пустые/битые ссылки для старых (легаси) вакансий без thumbnails —
 * нужен фолбэк large → medium → contentUrl.
 */
describe("galleryUrls", () => {
    it("использует thumbnails.large, когда он есть", () => {
        const image: Image = {
            id: "1",
            contentUrl: "https://cdn.example/original.jpg",
            thumbnails: { large: "https://cdn.example/large.jpg", medium: "https://cdn.example/medium.jpg", small: "" },
        };

        expect(galleryUrls([image])).toEqual(["https://cdn.example/large.jpg"]);
    });

    it("падает на thumbnails.medium, если large отсутствует", () => {
        // API в реальности иногда не отдаёт large для конкретного изображения,
        // хотя тип объявляет поле обязательной строкой — имитируем это как на
        // рантайме (нужен ?? , а не ||, отсюда и вылезла регрессия).
        const image = {
            id: "1",
            contentUrl: "https://cdn.example/original.jpg",
            thumbnails: { large: undefined, medium: "https://cdn.example/medium.jpg", small: "" },
        } as unknown as Image;

        expect(galleryUrls([image])).toEqual(["https://cdn.example/medium.jpg"]);
    });

    it("падает на contentUrl для легаси-вакансий без thumbnails", () => {
        const image: Image = {
            id: "1",
            contentUrl: "https://cdn.example/legacy-original.jpg",
        };

        expect(galleryUrls([image])).toEqual(["https://cdn.example/legacy-original.jpg"]);
    });

    it("отфильтровывает изображения без вообще какого-либо валидного URL", () => {
        const image: Image = { id: "1", contentUrl: "" };

        expect(galleryUrls([image])).toEqual([]);
    });
});

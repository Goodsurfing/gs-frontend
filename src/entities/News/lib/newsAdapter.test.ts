import { describe, it, expect } from "vitest";
import { newsArticleCardAdapter } from "./newsAdapter";
import { GetNewsList } from "../model/types/newsSchema";

/**
 * Регресс-тест: превьюшки пропадали на /ru/news для легаси-новостей без
 * thumbnails (только contentUrl) — адаптер передавал в getMediaContent
 * уже сузившуюся строку image?.thumbnails?.large (undefined), из-за чего
 * встроенный фолбэк на contentUrl внутри getMediaContent никогда не срабатывал.
 */
describe("newsArticleCardAdapter", () => {
    const base: GetNewsList = {
        id: "1",
        name: "Заголовок",
        description: "",
        created: "2026-01-01",
        reviewCount: 0,
        likeCount: 0,
        category: { id: "c1", name: "Другое" },
        image: {
            id: "img1",
            contentUrl: "https://cdn.example/legacy-original.png",
        },
    } as unknown as GetNewsList;

    it("падает на contentUrl для легаси-новостей без thumbnails", () => {
        const result = newsArticleCardAdapter(base);
        expect(result.image).toBe("https://cdn.example/legacy-original.png");
    });

    it("использует thumbnails.large, когда он есть", () => {
        const result = newsArticleCardAdapter({
            ...base,
            image: {
                id: "img2",
                contentUrl: "https://cdn.example/original.png",
                thumbnails: {
                    large: "https://cdn.example/large.webp",
                    medium: "https://cdn.example/medium.webp",
                    small: "https://cdn.example/small.webp",
                },
            },
        } as unknown as GetNewsList);
        expect(result.image).toBe("https://cdn.example/large.webp");
    });
});

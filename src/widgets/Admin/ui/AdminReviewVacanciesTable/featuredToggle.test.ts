import { describe, it, expect } from "vitest";
import {
    buildFeaturedEditBody, isFeaturedCapReached, MAX_FEATURED_REVIEWS,
} from "./featuredToggle";

/**
 * GS-84: логика быстрого переключателя "На главной" в списке отзывов.
 * Вынесена в чистые функции отдельно от AdminReviewVacanciesTable.tsx,
 * потому что сам компонент рендерит MUI DataGrid, который в jsdom не
 * виртуализирует строки без реального layout — тестировать через него
 * логику каждый раз ненадёжно.
 */
describe("isFeaturedCapReached", () => {
    it("не блокирует включение, пока лимит не достигнут", () => {
        expect(isFeaturedCapReached(9, true)).toBe(false);
    });

    it("блокирует включение, когда лимит уже достигнут", () => {
        expect(isFeaturedCapReached(MAX_FEATURED_REVIEWS, true)).toBe(true);
    });

    it("блокирует включение и при превышении лимита", () => {
        expect(isFeaturedCapReached(MAX_FEATURED_REVIEWS + 3, true)).toBe(true);
    });

    it("никогда не блокирует выключение, даже при переполненном лимите", () => {
        expect(isFeaturedCapReached(MAX_FEATURED_REVIEWS, false)).toBe(false);
    });
});

describe("buildFeaturedEditBody", () => {
    it("передаёт текущие rating/description вместе с новым isFeatured", () => {
        const row = {
            id: "review-1", rating: 4.5, description: "Отличная вакансия", isFeatured: false,
        };

        expect(buildFeaturedEditBody(row, true)).toEqual({
            rating: 4.5,
            description: "Отличная вакансия",
            isFeatured: true,
        });
    });

    it("не теряет описание при выключении показа на главной", () => {
        const row = {
            id: "review-1", rating: 5, description: "Текст отзыва", isFeatured: true,
        };

        expect(buildFeaturedEditBody(row, false)).toEqual({
            rating: 5,
            description: "Текст отзыва",
            isFeatured: false,
        });
    });
});

import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import ReviewsContainer from "./ReviewsContainer";

let mockFeaturedReviews: unknown[] | undefined;

vi.mock("@/entities/Review", () => ({
    useGetFeaturedReviewsQuery: () => ({ data: mockFeaturedReviews }),
}));

/**
 * GS-84: раньше этот блок на главной был захардкожен (Reviews.data.ts,
 * фейковые тексты со стоковыми фото), никак не связан с реальными
 * отзывами. Теперь тянет featured-отзывы через API — блок должен
 * прятаться, если избранных отзывов с фото нет (а не рендерить пустой
 * слайдер), и показывать реальные данные, когда они есть.
 */
describe("ReviewsContainer", () => {
    it("не рендерится, если избранных отзывов нет", () => {
        mockFeaturedReviews = [];
        const { container } = render(<ReviewsContainer />);
        expect(container).toBeEmptyDOMElement();
    });

    it("не рендерится, если у избранных отзывов нет фото", () => {
        mockFeaturedReviews = [{
            id: "1",
            title: "Без фото",
            description: "Текст",
            rating: 5,
            authorName: "Тест",
            authorAvatar: null,
            images: [],
        }];
        const { container } = render(<ReviewsContainer />);
        expect(container).toBeEmptyDOMElement();
    });

    it("рендерит отзыв, когда есть фото", () => {
        mockFeaturedReviews = [{
            id: "1",
            title: "Отзыв с фото",
            description: "Отличная поездка",
            rating: 5,
            authorName: "Тест Волонтёр",
            authorAvatar: null,
            images: [{ id: "img1", contentUrl: "https://example.com/1.jpg" }],
        }];
        render(<ReviewsContainer />);
        expect(screen.getByText("Отзыв с фото")).toBeInTheDocument();
    });
});

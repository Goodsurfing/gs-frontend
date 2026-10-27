import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewAboutHost } from "./ReviewAboutHost";

let mockFeaturedReviews: unknown[] | undefined;

vi.mock("@/entities/Review", () => ({
    useGetFeaturedReviewsQuery: () => ({ data: mockFeaturedReviews }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/Review", () => ({
    ReviewSlider: ({ reviews }: { reviews: { title?: string; text: string }[] }) => (
        <ul>{reviews.map((r) => <li key={r.title}>{`${r.title}: ${r.text}`}</li>)}</ul>
    ),
}));

/**
 * На /become-host блок «Отзывы о хостах» показывал заглушку — один выдуманный
 * отзыв три раза. Теперь — реальные отобранные отзывы; без них блок не
 * показывает заголовок и пустой слайдер, остаётся только кнопка.
 */
describe("ReviewAboutHost", () => {
    it("показывает реальные отобранные отзывы", () => {
        mockFeaturedReviews = [{
            id: "1",
            title: "Глэмпинг на Камчатке",
            vacancyId: 7228,
            description: "Очень отзывчивые хозяева",
            rating: 5,
            authorName: "Волонтёр",
            authorAvatar: null,
            images: [],
        }];
        render(<ReviewAboutHost />);
        expect(screen.getByText("Отзывы о хостах")).toBeInTheDocument();
        expect(screen.getByText("Глэмпинг на Камчатке: Очень отзывчивые хозяева")).toBeInTheDocument();
        expect(screen.queryByText(/Сезон в Крыму/)).not.toBeInTheDocument();
    });

    it("без отзывов прячет заголовок и слайдер, кнопка остаётся", () => {
        mockFeaturedReviews = [];
        render(<ReviewAboutHost />);
        expect(screen.queryByText("Отзывы о хостах")).not.toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});

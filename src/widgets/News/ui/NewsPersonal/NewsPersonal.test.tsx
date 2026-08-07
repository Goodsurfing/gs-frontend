import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { NewsPersonal } from "./NewsPersonal";

vi.mock("react-i18next", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback ?? key,
        ready: true,
        i18n: { changeLanguage: () => {} },
    }),
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: false, myProfile: null }),
}));

vi.mock("@/shared/ui/SeoHelmet", () => ({ SeoHelmet: () => null }));

const newsItem = {
    id: "1f17b75b-472b-69f4-95bf-092463684f00",
    slug: "kak-razmestit-materialy-v-bloge",
    name: "Как разместить материалы в блоге.",
    description: "<p>текст</p>",
    created: "2026-07-09",
    reviewCount: 0,
    likeCount: 0,
    image: null,
    category: { id: 1, name: "Онлайн", color: "#fff" },
};

const getReviews = vi.fn().mockReturnValue({
    unwrap: () => Promise.resolve({ data: [], pagination: { total: 0, page: 1 } }),
});

vi.mock("@/entities/News", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useGetNewsByIdQuery: () => ({ data: newsItem, isLoading: false }),
    useLazyGetReviewsNewsQuery: () => [getReviews, { data: undefined }],
}));

/**
 * Регресс-guard для row 117 (ЧПУ): переход по slug-ссылке на новость
 * (не сырой id) отправлял slug вместо настоящего id в review-news/list,
 * бэкенд падал 500. Blog/Journal уже чинили этот класс бага раньше,
 * News — нет.
 */
describe("NewsPersonal", () => {
    it("запрашивает комментарии по настоящему id новости, а не по slug из URL", async () => {
        renderWithProviders(
            <MemoryRouter>
                <NewsPersonal newsId="kak-razmestit-materialy-v-bloge" />
            </MemoryRouter>,
        );

        await waitFor(() => expect(getReviews).toHaveBeenCalled());

        expect(getReviews).toHaveBeenCalledWith(expect.objectContaining({
            newsId: newsItem.id,
        }));
        expect(getReviews).not.toHaveBeenCalledWith(expect.objectContaining({
            newsId: "kak-razmestit-materialy-v-bloge",
        }));
    });

    it("не показывает ошибку загрузки комментариев, когда id уже известен", async () => {
        renderWithProviders(
            <MemoryRouter>
                <NewsPersonal newsId="kak-razmestit-materialy-v-bloge" />
            </MemoryRouter>,
        );

        await waitFor(() => expect(getReviews).toHaveBeenCalled());
        expect(
            screen.queryByText("Произошла ошибка при подгрузке комментариев"),
        ).not.toBeInTheDocument();
    });
});

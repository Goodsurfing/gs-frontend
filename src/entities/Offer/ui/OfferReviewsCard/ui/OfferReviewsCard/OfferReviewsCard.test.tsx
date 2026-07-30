import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { OfferReviewsCard } from "./OfferReviewsCard";

/**
 * GS-91: форма написания отзыва (рейтинг + текст + загрузка фото) раньше
 * рендерилась всегда, просто в disabled-состоянии, когда canReview=false —
 * выглядело как баг для незалогиненных/неоткликнувшихся посетителей.
 * Теперь форма не рендерится вовсе, если canReview=false; список
 * существующих отзывов при этом остаётся видимым.
 */

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const getReviewsData = vi.fn().mockReturnValue({
    unwrap: () => Promise.resolve({ data: [], pagination: { total: 0, page: 1 } }),
});
const createOfferReview = vi.fn();
// Стабильная ссылка важна: если этот объект пересоздавать на каждый вызов
// мока, useEffect с [reviewsData] в зависимостях будет срабатывать на
// каждый рендер и уходить в бесконечный цикл setState → ререндер.
const reviewsQueryResult = { data: { data: [], pagination: { total: 0, page: 1 } } };

vi.mock("@/entities/Review", () => ({
    useLazyGetOfferReviewByVacancyIdQuery: () => [getReviewsData, reviewsQueryResult],
    useCreateOfferReviewMutation: () => [createOfferReview],
}));

describe("OfferReviewsCard", () => {
    beforeEach(() => {
        getReviewsData.mockClear();
    });

    it("не показывает форму написания отзыва, если canReview=false", async () => {
        render(<OfferReviewsCard offerId={1} canReview={false} />);

        await waitFor(() => expect(getReviewsData).toHaveBeenCalled());
        expect(screen.queryByPlaceholderText("personalOffer.Ваш отзыв")).not.toBeInTheDocument();
        expect(screen.queryByText("personalOffer.Написать отзыв")).not.toBeInTheDocument();
    });

    it("показывает форму написания отзыва, если canReview=true", async () => {
        render(<OfferReviewsCard offerId={1} canReview />);

        await waitFor(() => expect(getReviewsData).toHaveBeenCalled());
        expect(screen.getByPlaceholderText("personalOffer.Ваш отзыв")).toBeInTheDocument();
        expect(screen.getByText("personalOffer.Написать отзыв")).toBeInTheDocument();
    });
});

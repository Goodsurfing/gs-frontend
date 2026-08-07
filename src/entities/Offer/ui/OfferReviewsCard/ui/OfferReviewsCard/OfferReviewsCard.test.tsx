import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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

const AUTHOR_ID = "author-1";
const OTHER_USER_ID = "other-2";

type ReviewOverrides = { id: string; authorId: string; createdAt: string | null };

const makeReview = (overrides: Partial<ReviewOverrides> = {}) => ({
    id: overrides.id ?? "review-1",
    author: {
        id: overrides.authorId ?? AUTHOR_ID, firstName: "Аня", lastName: "Тест", image: null,
    },
    description: "Отличная поездка",
    rating: 5,
    createdAt: overrides.createdAt === undefined ? new Date().toISOString() : overrides.createdAt,
    images: [],
});

let reviewsQueryResult = { data: { data: [makeReview()], pagination: { total: 1, page: 1 } } };
const getReviewsData = vi.fn().mockImplementation(() => ({
    unwrap: () => Promise.resolve(reviewsQueryResult.data),
}));
const createOfferReview = vi.fn();
const deleteOfferReview = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
let mockMyProfileId: string | null = AUTHOR_ID;

vi.mock("@/entities/Review", () => ({
    useLazyGetOfferReviewByVacancyIdQuery: () => [getReviewsData, reviewsQueryResult],
    useCreateOfferReviewMutation: () => [createOfferReview],
    useDeleteOfferReviewMutation: () => [deleteOfferReview],
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ myProfile: mockMyProfileId ? { id: mockMyProfileId } : null }),
}));

/**
 * GS-91: форма написания отзыва (рейтинг + текст + загрузка фото) раньше
 * рендерилась всегда, просто в disabled-состоянии, когда canReview=false —
 * выглядело как баг для незалогиненных/неоткликнувшихся посетителей.
 * Теперь форма не рендерится вовсе, если canReview=false; список
 * существующих отзывов при этом остаётся видимым.
 */
describe("OfferReviewsCard", () => {
    beforeEach(() => {
        getReviewsData.mockClear();
        deleteOfferReview.mockClear();
        mockMyProfileId = AUTHOR_ID;
        reviewsQueryResult = { data: { data: [makeReview()], pagination: { total: 1, page: 1 } } };
    });

    it("не показывает форму написания отзыва, если canReview=false", async () => {
        reviewsQueryResult = { data: { data: [], pagination: { total: 0, page: 1 } } };
        render(<MemoryRouter><OfferReviewsCard offerId={1} canReview={false} /></MemoryRouter>);

        await waitFor(() => expect(getReviewsData).toHaveBeenCalled());
        expect(screen.queryByPlaceholderText("personalOffer.Ваш отзыв")).not.toBeInTheDocument();
        expect(screen.queryByText("personalOffer.Написать отзыв")).not.toBeInTheDocument();
    });

    it("показывает форму написания отзыва, если canReview=true", async () => {
        reviewsQueryResult = { data: { data: [], pagination: { total: 0, page: 1 } } };
        render(<MemoryRouter><OfferReviewsCard offerId={1} canReview /></MemoryRouter>);

        await waitFor(() => expect(getReviewsData).toHaveBeenCalled());
        expect(screen.getByPlaceholderText("personalOffer.Ваш отзыв")).toBeInTheDocument();
        expect(screen.getByText("personalOffer.Написать отзыв")).toBeInTheDocument();
    });

    /**
     * GS-132: самостоятельное удаление своего отзыва — только в течение
     * 24 часов после публикации, только автору.
     */
    it("показывает кнопку удаления для своего свежего отзыва и удаляет по подтверждению", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        render(<MemoryRouter><OfferReviewsCard offerId={1} canReview={false} /></MemoryRouter>);

        const deleteBtn = await screen.findByRole("button", { name: /удалить отзыв/i });
        await userEvent.click(deleteBtn);

        expect(deleteOfferReview).toHaveBeenCalledWith("review-1");
    });

    it("не показывает кнопку удаления для чужого отзыва", async () => {
        mockMyProfileId = OTHER_USER_ID;
        render(<MemoryRouter><OfferReviewsCard offerId={1} canReview={false} /></MemoryRouter>);

        await waitFor(() => expect(getReviewsData).toHaveBeenCalled());
        expect(screen.queryByRole("button", { name: /удалить отзыв/i })).not.toBeInTheDocument();
    });

    it("не показывает кнопку удаления для своего отзыва старше 24 часов", async () => {
        const staleCreatedAt = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
        reviewsQueryResult = {
            data: {
                data: [makeReview({ createdAt: staleCreatedAt })],
                pagination: { total: 1, page: 1 },
            },
        };
        render(<MemoryRouter><OfferReviewsCard offerId={1} canReview={false} /></MemoryRouter>);

        await waitFor(() => expect(getReviewsData).toHaveBeenCalled());
        expect(screen.queryByRole("button", { name: /удалить отзыв/i })).not.toBeInTheDocument();
    });

    it("не удаляет отзыв, если пользователь отменил подтверждение", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);
        render(<MemoryRouter><OfferReviewsCard offerId={1} canReview={false} /></MemoryRouter>);

        const deleteBtn = await screen.findByRole("button", { name: /удалить отзыв/i });
        await userEvent.click(deleteBtn);

        expect(deleteOfferReview).not.toHaveBeenCalled();
    });
});

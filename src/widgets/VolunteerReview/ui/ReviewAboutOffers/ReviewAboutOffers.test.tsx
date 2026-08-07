import {
    describe, it, expect, vi,
} from "vitest";
import {
    screen, waitFor, fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { ReviewAboutOffers } from "./ReviewAboutOffers";

vi.mock("react-i18next", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
}));

const notDoneReview = {
    id: 6293,
    name: "Работа ГИДОМ-ЭКСКУРСОВОДОМ НА БАЙКАЛЕ",
    image: null,
    address: "Ольхон",
    applicationStatus: "completed",
    categories: [{ id: 1, name: "Другое" }],
};

const createOfferReview = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({}) });
const getMyReviews = vi.fn().mockReturnValue({
    unwrap: () => Promise.resolve({ data: [], pagination: { total: 0, page: 1 } }),
});

vi.mock("@/entities/Review", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useGetMyNotDoneVolunteerReviewQuery: () => ({ data: [notDoneReview], isLoading: false }),
    useLazyGetMyVolunteerReviewsQuery: () => [getMyReviews, { isLoading: false }],
    useCreateOfferReviewMutation: () => [createOfferReview],
}));

describe("ReviewAboutOffers", () => {
    it("отправляет отзыв с правильным vacancyId, рейтингом и текстом", async () => {
        renderWithProviders(
            <MemoryRouter><ReviewAboutOffers locale="ru" /></MemoryRouter>,
        );

        await waitFor(() => expect(
            screen.getByText("volunteer-review.Добавить отзыв"),
        ).toBeInTheDocument());

        fireEvent.click(screen.getByText("volunteer-review.Добавить отзыв"));

        await waitFor(() => expect(screen.getByText("Оставьте отзыв")).toBeInTheDocument());

        const stars = screen.getAllByRole("radio");
        fireEvent.click(stars[4]);

        const textarea = screen.getByRole("textbox");
        fireEvent.change(textarea, { target: { value: "Отличная вакансия!" } });

        const submitButton = screen.getByRole("button", { name: "host-dashboard.Оставить отзыв" });
        expect(submitButton).not.toBeDisabled();
        fireEvent.click(submitButton);

        await waitFor(() => expect(createOfferReview).toHaveBeenCalledWith({
            vacancyId: notDoneReview.id,
            description: "Отличная вакансия!",
            rating: 5,
            imageIds: [],
        }));
    });

    it("не отправляет отзыв, пока не выставлена оценка", async () => {
        renderWithProviders(
            <MemoryRouter><ReviewAboutOffers locale="ru" /></MemoryRouter>,
        );

        await waitFor(() => expect(
            screen.getByText("volunteer-review.Добавить отзыв"),
        ).toBeInTheDocument());
        fireEvent.click(screen.getByText("volunteer-review.Добавить отзыв"));

        await waitFor(() => expect(screen.getByText("Оставьте отзыв")).toBeInTheDocument());
        expect(screen.getByRole("button", { name: "host-dashboard.Оставить отзыв" })).toBeDisabled();
    });
});

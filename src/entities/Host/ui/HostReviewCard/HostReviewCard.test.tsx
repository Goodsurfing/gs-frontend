import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { HostReviewCard } from "./HostReviewCard";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const reviewsData = {
    data: [
        {
            id: "review-1", firstName: "Аня", lastName: null, image: null, description: "Отлично", rating: 5,
        },
        {
            id: "review-2", firstName: "Боря", lastName: null, image: null, description: "Хорошо", rating: 4,
        },
    ],
    pagination: { total: 2, page: 1 },
};
const getReviewsData = vi.fn().mockReturnValue({
    unwrap: () => Promise.resolve(reviewsData),
});

vi.mock("@/entities/Review/api/reviewApi", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useLazyGetHostReviewByHostIdQuery: () => [getReviewsData, { data: reviewsData }],
}));

/**
 * Регресс-guard: список отзывов на странице организации рендерился без
 * key (React warning "Each child in a list should have a unique key
 * prop") — та же категория бага, что и GS-96 у OfferWhenCard.
 */
describe("HostReviewCard", () => {
    it("не выдаёт React-предупреждение об отсутствии key при рендере нескольких отзывов", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        renderWithProviders(
            <MemoryRouter>
                <HostReviewCard hostId="host-1" />
            </MemoryRouter>,
        );

        await waitFor(() => expect(screen.getByText("Отлично")).toBeInTheDocument());

        const hasKeyWarning = consoleErrorSpy.mock.calls.some(
            (call) => typeof call[0] === "string" && call[0].includes("unique \"key\" prop"),
        );
        expect(hasKeyWarning).toBe(false);

        consoleErrorSpy.mockRestore();
    });
});

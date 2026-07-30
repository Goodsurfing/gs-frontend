import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminReviewVacanciesTable } from "./AdminReviewVacanciesTable";
import { MAX_FEATURED_REVIEWS } from "./featuredToggle";

/**
 * GS-84: смоук-тест на счётчик "На главной: X из N" в списке отзывов на
 * вакансии — сам переключатель и лимит покрыты юнит-тестами в
 * featuredToggle.test.ts (MUI DataGrid не виртуализирует строки в jsdom
 * без реального layout, поэтому кликать по ячейкам сетки в тесте
 * ненадёжно).
 */

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/OffersMap", () => ({
    OfferPagination: () => null,
}));

let featuredCountTotal = 0;

vi.mock("@/entities/Admin", async () => {
    const actual = await vi.importActual<typeof import("@/entities/Admin")>("@/entities/Admin");
    return {
        ...actual,
        useLazyGetAdminReviewVacanciesListQuery: () => [
            vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() }),
            { data: { data: [], pagination: { total: 0 } }, isLoading: false, isFetching: false },
        ],
        useGetAdminReviewVacanciesListQuery: () => ({
            data: { data: [], pagination: { total: featuredCountTotal } },
        }),
        useEditAdminReviewVacancyMutation: () => [vi.fn(), { isLoading: false }],
        useDeleteAdminReviewVacancyMutation: () => [vi.fn(), { isLoading: false }],
    };
});

describe("AdminReviewVacanciesTable — счётчик отзывов на главной", () => {
    beforeEach(() => {
        featuredCountTotal = 0;
    });

    it(`показывает 0 из ${MAX_FEATURED_REVIEWS}, когда ни один отзыв не выбран`, () => {
        render(<AdminReviewVacanciesTable />);

        expect(screen.getByText(`На главной: 0 из ${MAX_FEATURED_REVIEWS}`)).toBeInTheDocument();
    });

    it("отражает реальное количество выбранных отзывов", () => {
        featuredCountTotal = 3;
        render(<AdminReviewVacanciesTable />);

        expect(screen.getByText(`На главной: 3 из ${MAX_FEATURED_REVIEWS}`)).toBeInTheDocument();
    });
});

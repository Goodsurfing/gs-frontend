import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminOffersTable } from "./AdminOffersTable";
import { MAX_FEATURED_OFFERS } from "./featuredToggle";

/**
 * GS-86: смоук-тест на счётчик "На главной: X из N" в списке вакансий —
 * сам переключатель и лимит покрыты юнит-тестами в featuredToggle.test.ts
 * (MUI DataGrid не виртуализирует строки в jsdom без реального layout,
 * поэтому кликать по ячейкам сетки в тесте ненадёжно).
 */

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
        useLazyGetAdminOffersQuery: () => [
            vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() }),
            { data: { data: [], pagination: { total: 0 } }, isLoading: false, isFetching: false },
        ],
        useGetAdminOffersQuery: () => ({
            data: { data: [], pagination: { total: featuredCountTotal } },
        }),
        useUpdateAdminVacancyStatusMutation: () => [vi.fn(), { isLoading: false }],
        useUpdateAdminVacancyFeaturedMutation: () => [vi.fn(), { isLoading: false }],
        useDeleteAdminOfferMutation: () => [vi.fn(), { isLoading: false }],
    };
});

describe("AdminOffersTable — счётчик вакансий на главной", () => {
    beforeEach(() => {
        featuredCountTotal = 0;
    });

    it(`показывает 0 из ${MAX_FEATURED_OFFERS}, когда ни одна вакансия не выбрана`, () => {
        render(<AdminOffersTable />);

        expect(screen.getByText(`На главной: 0 из ${MAX_FEATURED_OFFERS}`)).toBeInTheDocument();
    });

    it("отражает реальное количество выбранных вакансий", () => {
        featuredCountTotal = 4;
        render(<AdminOffersTable />);

        expect(screen.getByText(`На главной: 4 из ${MAX_FEATURED_OFFERS}`)).toBeInTheDocument();
    });
});

import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { InternationalClub } from "./InternationalClub";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const mockUseGetTariffsQuery = vi.fn();
vi.mock("@/store/api/membershipApi", () => ({
    useGetTariffsQuery: (arg: unknown) => mockUseGetTariffsQuery(arg),
}));

describe("InternationalClub", () => {
    /**
     * Правка из чек-листа: на /membership не была видна цена
     * международного клуба (5000 руб/год) — только кнопка оплаты без
     * указания суммы. Реальная цена берётся из тарифа, как у
     * ForVolunteer/ForHost, а не хардкодится.
     */
    it("показывает цену из тарифа international_5000", () => {
        mockUseGetTariffsQuery.mockReturnValue({
            data: [{ code: "international_5000", priceRub: 5000 }],
        });

        render(<InternationalClub />, { wrapper: MemoryRouter });

        expect(screen.getByText("5 000")).toBeInTheDocument();
    });

    it("падает обратно на дефолтную цену 5000, если тариф ещё не загрузился", () => {
        mockUseGetTariffsQuery.mockReturnValue({ data: undefined });

        render(<InternationalClub />, { wrapper: MemoryRouter });

        expect(screen.getByText("5 000")).toBeInTheDocument();
    });
});

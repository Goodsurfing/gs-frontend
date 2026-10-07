import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import VolunteerDashboardPage from "./VolunteerDashboardPage";

const useGetProfileOccupancyQueryMock = vi.fn();

vi.mock("@/entities/Profile", () => ({
    useGetProfileOccupancyQuery: () => useGetProfileOccupancyQueryMock(),
}));

vi.mock("@/features/VolunteerFill", () => ({ VolunteerFill: () => null }));
vi.mock("@/widgets/OffersRecomendationsWidget", () => ({ OffersRecomendationsWidget: () => null }));
vi.mock("@/widgets/DashboardNotifications", () => ({ DashboardNotifications: () => null }));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// FreeApplicationsCounter (GS-171) reads auth state directly via useAppSelector —
// this test suite renders without a real <Provider>, so stub it unauthenticated
// (the component itself renders null in that case, same as before its addition).
vi.mock("@/shared/hooks/redux", () => ({
    useAppSelector: () => undefined,
}));

/**
 * Живьём поймано на staging 2026-09-20: после оплаты членства баннер
 * «Оформи членство Гудсёрфинга» продолжал висеть на дашборде — MemberBanner
 * рендерился безусловно, не глядя на profile/occupancy.isMembership.
 */
describe("VolunteerDashboardPage — баннер членства", () => {
    it("показывает баннер «Получить членство», если членства ещё нет", () => {
        useGetProfileOccupancyQueryMock.mockReturnValue({ data: { isMembership: false } });

        render(<VolunteerDashboardPage />);

        expect(screen.getByRole("button", { name: /получить членство/i })).toBeInTheDocument();
    });

    it("скрывает баннер «Получить членство», если членство уже активно", () => {
        useGetProfileOccupancyQueryMock.mockReturnValue({ data: { isMembership: true } });

        render(<VolunteerDashboardPage />);

        expect(screen.queryByRole("button", { name: /получить членство/i })).not.toBeInTheDocument();
    });
});

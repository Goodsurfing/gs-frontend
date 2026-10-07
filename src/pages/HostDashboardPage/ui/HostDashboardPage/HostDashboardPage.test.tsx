import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import HostDashboardPage from "./HostDashboardPage";

const useGetProfileOccupancyQueryMock = vi.fn();

vi.mock("@/entities/Profile", () => ({
    useGetProfileOccupancyQuery: () => useGetProfileOccupancyQueryMock(),
}));

vi.mock("@/features/HostFill", () => ({ HostFill: () => null }));
vi.mock("@/widgets/RequestsWidget", () => ({ RequestsWidget: () => null }));
vi.mock("@/widgets/DashboardNotifications/", () => ({ DashboardNotifications: () => null }));
vi.mock("@/features/PublishedVacanciesCounter", () => ({ PublishedVacanciesCounter: () => null }));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key, ready: true }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Тот же баг, что и на дашборде волонтёра (staging, 2026-09-20): MemberBanner
 * рендерился безусловно, не глядя на profile/occupancy.isMembership.
 */
describe("HostDashboardPage — баннер членства", () => {
    it("показывает баннер «Получить членство», если членства ещё нет", () => {
        useGetProfileOccupancyQueryMock.mockReturnValue({ data: { isMembership: false } });

        render(<HostDashboardPage />);

        expect(screen.getByRole("button", { name: /получить членство/i })).toBeInTheDocument();
    });

    it("скрывает баннер «Получить членство», если членство уже активно", () => {
        useGetProfileOccupancyQueryMock.mockReturnValue({ data: { isMembership: true } });

        render(<HostDashboardPage />);

        expect(screen.queryByRole("button", { name: /получить членство/i })).not.toBeInTheDocument();
    });
});

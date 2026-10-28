import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileMembershipBanner } from "./ProfileMembershipBanner";

const { mockUseGetCurrentAllMembershipsQuery, mockNavigate } = vi.hoisted(() => ({
    mockUseGetCurrentAllMembershipsQuery: vi.fn(),
    mockNavigate: vi.fn(),
}));

vi.mock("@/store/api/membershipApi", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/store/api/membershipApi")>();
    return {
        ...actual,
        useGetCurrentAllMembershipsQuery: mockUseGetCurrentAllMembershipsQuery,
    };
});

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

/**
 * GS-170: без активного членства — две колонки (волонтёр/организатор),
 * с активным — "активно до" + "Продлить членство" с якорем по тарифу.
 */
describe("ProfileMembershipBanner", () => {
    it("показывает две колонки (волонтёр/организатор) без членства", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({ data: [] });

        render(<ProfileMembershipBanner />);

        expect(screen.getByText(/Получи возможность оставлять неограниченное количество откликов/)).toBeInTheDocument();
        expect(screen.getByText(/Создавай неограниченное количество вакансий/)).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: "info.Оформить членство" })).toHaveLength(2);
    });

    it("клик по кнопке организатора ведёт на /membership#host", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({ data: [] });

        render(<ProfileMembershipBanner />);

        const buttons = screen.getAllByRole("button", { name: "info.Оформить членство" });
        fireEvent.click(buttons[1]);

        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("#host"));
    });

    it("показывает «активно до» и кнопку продления с активным членством", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({
            data: [{
                isActive: true,
                endDate: "2026-12-31T00:00:00+00:00",
                tariff: { forRole: "VOLUNTEER", category: "REGULAR" },
            }],
        });

        render(<ProfileMembershipBanner />);

        expect(screen.getByText(/info\.Членство активно до/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "info.Продлить членство" })).toBeInTheDocument();
    });

    it("продление для тарифа организатора ведёт на /membership#host", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({
            data: [{
                isActive: true,
                endDate: "2026-12-31T00:00:00+00:00",
                tariff: { forRole: "HOST", category: "REGULAR" },
            }],
        });

        render(<ProfileMembershipBanner />);

        fireEvent.click(screen.getByRole("button", { name: "info.Продлить членство" }));

        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("#host"));
    });
    // GS-198: Международный клуб — отдельное членство, обычное не заменяет.
    const regular = {
        isActive: true,
        endDate: "2026-12-31T00:00:00+00:00",
        tariff: { forRole: "VOLUNTEER", category: "REGULAR" },
    };
    const international = {
        isActive: true,
        endDate: "2027-06-01T00:00:00+00:00",
        tariff: { forRole: "BOTH", category: "INTERNATIONAL" },
    };

    it("только клуб: предлагаем обычное членство и показываем строку клуба", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({ data: [international] });

        render(<ProfileMembershipBanner />);

        expect(screen.getAllByRole("button", { name: "info.Оформить членство" })).toHaveLength(2);
        expect(screen.getByText(/info\.Международный клуб — активно до/)).toBeInTheDocument();
        expect(screen.queryByText(/info\.Членство активно до/)).toBeNull();
    });

    it("обычное и клуб: оба статуса, продление клуба ведёт на /membership#international", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({ data: [regular, international] });

        render(<ProfileMembershipBanner />);

        expect(screen.getByText(/info\.Членство активно до/)).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "info.Продлить участие" }));
        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("#international"));
    });

    it("только обычное: строки про клуб нет", () => {
        mockUseGetCurrentAllMembershipsQuery.mockReturnValue({ data: [regular] });

        render(<ProfileMembershipBanner />);

        expect(screen.queryByText(/Международный клуб/)).toBeNull();
    });
});

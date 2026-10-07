import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileMembershipBanner } from "./ProfileMembershipBanner";

const { mockUseGetCurrentMembershipQuery, mockNavigate } = vi.hoisted(() => ({
    mockUseGetCurrentMembershipQuery: vi.fn(),
    mockNavigate: vi.fn(),
}));

vi.mock("@/store/api/membershipApi", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/store/api/membershipApi")>();
    return {
        ...actual,
        useGetCurrentMembershipQuery: mockUseGetCurrentMembershipQuery,
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
        mockUseGetCurrentMembershipQuery.mockReturnValue({ data: { isActive: false } });

        render(<ProfileMembershipBanner />);

        expect(screen.getByText(/Получи возможность оставлять неограниченное количество откликов/)).toBeInTheDocument();
        expect(screen.getByText(/Создавай неограниченное количество вакансий/)).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: "info.Оформить членство" })).toHaveLength(2);
    });

    it("клик по кнопке организатора ведёт на /membership#host", () => {
        mockUseGetCurrentMembershipQuery.mockReturnValue({ data: { isActive: false } });

        render(<ProfileMembershipBanner />);

        const buttons = screen.getAllByRole("button", { name: "info.Оформить членство" });
        fireEvent.click(buttons[1]);

        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("#host"));
    });

    it("показывает «активно до» и кнопку продления с активным членством", () => {
        mockUseGetCurrentMembershipQuery.mockReturnValue({
            data: {
                isActive: true, endDate: "2026-12-31T00:00:00+00:00", tariff: { forRole: "VOLUNTEER" },
            },
        });

        render(<ProfileMembershipBanner />);

        expect(screen.getByText(/info\.Членство активно до/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "info.Продлить членство" })).toBeInTheDocument();
    });

    it("продление для тарифа организатора ведёт на /membership#host", () => {
        mockUseGetCurrentMembershipQuery.mockReturnValue({
            data: {
                isActive: true, endDate: "2026-12-31T00:00:00+00:00", tariff: { forRole: "HOST" },
            },
        });

        render(<ProfileMembershipBanner />);

        fireEvent.click(screen.getByRole("button", { name: "info.Продлить членство" }));

        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("#host"));
    });
});

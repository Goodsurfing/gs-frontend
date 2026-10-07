import React from "react";
import {
    describe, it, expect, vi, beforeEach, afterEach,
} from "vitest";
import {
    render, screen, fireEvent, act,
} from "@testing-library/react";
import { MembershipTimedPopup } from "./MembershipTimedPopup";

const { mockUseGetProfileOccupancyQuery, mockUseAppSelector, mockNavigate } = vi.hoisted(() => ({
    mockUseGetProfileOccupancyQuery: vi.fn(),
    mockUseAppSelector: vi.fn(),
    mockNavigate: vi.fn(),
}));

vi.mock("@/entities/Profile", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/entities/Profile")>();
    return {
        ...actual,
        useGetProfileOccupancyQuery: mockUseGetProfileOccupancyQuery,
    };
});

vi.mock("@/shared/hooks/redux", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/shared/hooks/redux")>();
    return {
        ...actual,
        useAppSelector: mockUseAppSelector,
    };
});

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

const POPUP_DELAY_MS = 2 * 60 * 1000;
const SESSION_STORAGE_KEY = "membershipTimedPopupShown";

/**
 * GS-174: опциональный попап с предложением членства через 1-3 минуты на
 * сайте (документ сам отмечает это необязательным) — не чаще раза за
 * сессию, с текстом по роли (волонтёр/организатор без членства).
 */
describe("MembershipTimedPopup", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        sessionStorage.clear();
        mockNavigate.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("не показывается неавторизованному пользователю", () => {
        mockUseAppSelector.mockReturnValue(undefined);
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: undefined });

        render(<MembershipTimedPopup />);
        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        expect(document.querySelector(".buttonClose")).not.toBeInTheDocument();
    });

    it("не показывается пользователю с активным членством", () => {
        mockUseAppSelector.mockReturnValue({ username: "member@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: {
                isMembership: true, remainingFreeApplications: null, remainingFreeVacancies: null,
            },
        });

        render(<MembershipTimedPopup />);
        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        expect(document.querySelector(".buttonClose")).not.toBeInTheDocument();
    });

    it("показывает волонтёрский баннер через заданную задержку без членства", () => {
        mockUseAppSelector.mockReturnValue({ username: "vol@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: {
                isMembership: false, remainingFreeApplications: 1, remainingFreeVacancies: null,
            },
        });

        render(<MembershipTimedPopup />);

        expect(document.querySelector(".buttonClose")).not.toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        expect(document.querySelector(".buttonClose")).toBeInTheDocument();
    });

    it("показывает баннер организатора, когда remainingFreeVacancies не null", () => {
        mockUseAppSelector.mockReturnValue({ username: "host@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: {
                isMembership: false, remainingFreeApplications: null, remainingFreeVacancies: 1,
            },
        });

        render(<MembershipTimedPopup />);
        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        expect(screen.getByText("host-dashboard.Зарегистрируй членство организатора и получи больше возможностей для своего проекта!")).toBeInTheDocument();
    });

    it("клик по кнопке ведёт на /membership с якорем #host для организатора", () => {
        mockUseAppSelector.mockReturnValue({ username: "host@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: {
                isMembership: false, remainingFreeApplications: null, remainingFreeVacancies: 1,
            },
        });

        render(<MembershipTimedPopup />);
        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        fireEvent.click(screen.getByRole("button"));

        expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("#host"));
    });

    it("закрывается по клику на крестик", () => {
        mockUseAppSelector.mockReturnValue({ username: "vol@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: {
                isMembership: false, remainingFreeApplications: 1, remainingFreeVacancies: null,
            },
        });

        render(<MembershipTimedPopup />);
        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        fireEvent.click(document.querySelector(".buttonClose")!);

        expect(document.querySelector(".buttonClose")).not.toBeInTheDocument();
    });

    it("не показывается повторно в рамках той же сессии (sessionStorage)", () => {
        sessionStorage.setItem(SESSION_STORAGE_KEY, "1");
        mockUseAppSelector.mockReturnValue({ username: "vol@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: {
                isMembership: false, remainingFreeApplications: 1, remainingFreeVacancies: null,
            },
        });

        render(<MembershipTimedPopup />);
        act(() => {
            vi.advanceTimersByTime(POPUP_DELAY_MS + 1000);
        });

        expect(document.querySelector(".buttonClose")).not.toBeInTheDocument();
    });
});

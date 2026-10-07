import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { FreeApplicationsCounter } from "./FreeApplicationsCounter";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const { mockUseGetProfileOccupancyQuery, mockUseAppSelector } = vi.hoisted(() => ({
    mockUseGetProfileOccupancyQuery: vi.fn(),
    mockUseAppSelector: vi.fn(),
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

const renderCounter = () => renderWithProviders(
    <MemoryRouter>
        <FreeApplicationsCounter />
    </MemoryRouter>,
);

/**
 * GS-171: тот же источник данных (profile/occupancy.remainingFreeApplications),
 * что и блокировка кнопки «Участвовать» в GS-169, должен быть виден заранее —
 * на /offers-map и дашборде волонтёра, а не только в момент отклика.
 */
describe("FreeApplicationsCounter", () => {
    it("не рендерится для неавторизованного пользователя", () => {
        mockUseAppSelector.mockReturnValue(undefined);
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: undefined });

        const { container } = renderCounter();

        expect(container).toBeEmptyDOMElement();
    });

    it("показывает остаток откликов и ссылку на /membership без членства", () => {
        mockUseAppSelector.mockReturnValue({ username: "vol@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: { isMembership: false, remainingFreeApplications: 1 },
        });

        renderCounter();

        expect(screen.getByText(/1/)).toBeInTheDocument();
        expect(screen.getByText(/3/)).toBeInTheDocument();
        const link = screen.getByRole("link", { name: "freeApplicationsCounter.Нужно больше? Оформите членство!" });
        expect(link).toHaveAttribute("href", expect.stringContaining("/membership"));
    });

    it("показывает ∞ и подсказку про продление для активного членства", () => {
        mockUseAppSelector.mockReturnValue({ username: "host@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: { isMembership: true, remainingFreeApplications: null },
        });

        renderCounter();

        expect(screen.getByText("∞")).toBeInTheDocument();
        expect(screen.getByRole("link", {
            name: "freeApplicationsCounter.Не забудьте продлить членство, чтобы сохранить привилегии",
        })).toBeInTheDocument();
    });
});

import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { PublishedVacanciesCounter } from "./PublishedVacanciesCounter";

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
        <PublishedVacanciesCounter />
    </MemoryRouter>,
);

/**
 * GS-172: тот же принцип, что и FreeApplicationsCounter (GS-171) — лимит уже
 * применяется на бэкенде при публикации (ToggleStatusHandler), должен быть
 * виден хосту заранее на /host/host-dashboard, а не только в момент ошибки.
 */
describe("PublishedVacanciesCounter", () => {
    it("не рендерится для неавторизованного пользователя", () => {
        mockUseAppSelector.mockReturnValue(undefined);
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: undefined });

        const { container } = renderCounter();

        expect(container).toBeEmptyDOMElement();
    });

    it("показывает остаток вакансий и ссылку на /membership без членства", () => {
        mockUseAppSelector.mockReturnValue({ username: "host@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: { isMembership: false, remainingFreeVacancies: 1 },
        });

        renderCounter();

        expect(screen.getByText(/1/)).toBeInTheDocument();
        const link = screen.getByRole("link", { name: "publishedVacanciesCounter.Нужно больше? Оформите членство!" });
        expect(link).toHaveAttribute("href", expect.stringContaining("/membership"));
    });

    it("показывает 0/1, когда бесплатная вакансия уже опубликована", () => {
        mockUseAppSelector.mockReturnValue({ username: "host@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: { isMembership: false, remainingFreeVacancies: 0 },
        });

        renderCounter();

        expect(screen.getByText(/0/)).toBeInTheDocument();
    });

    it("показывает ∞ и подсказку про продление для активного членства", () => {
        mockUseAppSelector.mockReturnValue({ username: "host@test.local" });
        mockUseGetProfileOccupancyQuery.mockReturnValue({
            data: { isMembership: true, remainingFreeVacancies: null },
        });

        renderCounter();

        expect(screen.getByText("∞")).toBeInTheDocument();
        expect(screen.getByRole("link", {
            name: "publishedVacanciesCounter.Не забудьте продлить членство, чтобы сохранить привилегии",
        })).toBeInTheDocument();
    });
});

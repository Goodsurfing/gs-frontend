import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HostUpsellBanner } from "./HostUpsellBanner";

const { mockUseGetProfileOccupancyQuery, mockUseGetMyHostQuery } = vi.hoisted(() => ({
    mockUseGetProfileOccupancyQuery: vi.fn(),
    mockUseGetMyHostQuery: vi.fn(),
}));

vi.mock("@/entities/Profile", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/entities/Profile")>();
    return {
        ...actual,
        useGetProfileOccupancyQuery: mockUseGetProfileOccupancyQuery,
    };
});

vi.mock("@/entities/Host", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/entities/Host")>();
    return {
        ...actual,
        useGetMyHostQuery: mockUseGetMyHostQuery,
    };
});

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const renderBanner = (kind: "consultation" | "mediaSupport") => render(
    <MemoryRouter>
        <HostUpsellBanner kind={kind} />
    </MemoryRouter>,
);

/**
 * GS-151: без членства — предложение оформить (MemberBanner), с
 * членством — инструкция написать на поддержку с готовой темой письма
 * (включающей название организации).
 */
describe("HostUpsellBanner", () => {
    it("показывает MemberBanner без активного членства", () => {
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: { isMembership: false } });
        mockUseGetMyHostQuery.mockReturnValue({ data: { name: "Тестовая организация" } });

        renderBanner("consultation");

        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("показывает mailto-ссылку с темой письма, включающей название организации (consultation)", () => {
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: { isMembership: true } });
        mockUseGetMyHostQuery.mockReturnValue({ data: { name: "Тестовая организация" } });

        renderBanner("consultation");

        const link = screen.getByRole("link", { name: "support@goodsurfing.org" });
        const href = link.getAttribute("href") ?? "";
        expect(href).toContain("mailto:support@goodsurfing.org");
        expect(decodeURIComponent(href)).toContain("Тестовая организация");
    });

    it("использует другую тему письма для mediaSupport", () => {
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: { isMembership: true } });
        mockUseGetMyHostQuery.mockReturnValue({ data: { name: "Тестовая организация" } });

        renderBanner("mediaSupport");

        const link = screen.getByRole("link", { name: "support@goodsurfing.org" });
        const href = decodeURIComponent(link.getAttribute("href") ?? "");
        expect(href).toContain("hostUpsellBanner.Медиаподдержка");
        expect(href).not.toContain("hostUpsellBanner.Консультация по продвижению");
    });

    it("не рендерится до загрузки occupancy", () => {
        mockUseGetProfileOccupancyQuery.mockReturnValue({ data: undefined });
        mockUseGetMyHostQuery.mockReturnValue({ data: undefined });

        const { container } = renderBanner("consultation");

        expect(container).toBeEmptyDOMElement();
    });
});

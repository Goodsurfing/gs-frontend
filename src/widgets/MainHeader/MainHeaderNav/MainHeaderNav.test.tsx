import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { MainHeaderNav } from "./MainHeaderNav";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Регресс-тест для rows 79/80 (навигация): пункты меню «Экспедиции» и
 * «Международное волонтёрство» ведут на отдельные поддомены проекта
 * (expedition.goodsurfing.org, international.goodsurfing.org).
 */
describe("MainHeaderNav", () => {
    it("пункт меню \"Экспедиции\" ведёт на expedition.goodsurfing.org", () => {
        renderWithProviders(
            <MemoryRouter>
                <MainHeaderNav />
            </MemoryRouter>,
        );

        const link = screen.getByText("Экспедиции").closest("a");
        expect(link).toHaveAttribute("href", "https://expedition.goodsurfing.org/");
    });

    it("пункт меню \"Международное волонтёрство\" ведёт на international.goodsurfing.org", () => {
        renderWithProviders(
            <MemoryRouter>
                <MainHeaderNav />
            </MemoryRouter>,
        );

        const link = screen.getByText("Международное волонтёрство").closest("a");
        expect(link).toHaveAttribute("href", "https://international.goodsurfing.org/");
    });

    it("на своей странице пункт меню — отметка «вы здесь», а не ссылка на себя", () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/membership"]}>
                <MainHeaderNav />
            </MemoryRouter>,
        );

        const current = screen.getByText("main.welcome.header.donation.support-goodsurfing");
        expect(current.closest("a")).toBeNull();
        expect(current).toHaveAttribute("aria-current", "page");

        const other = screen.getByText("main.welcome.header.donation.rating-donations");
        expect(other.closest("a")).not.toBeNull();
    });
});

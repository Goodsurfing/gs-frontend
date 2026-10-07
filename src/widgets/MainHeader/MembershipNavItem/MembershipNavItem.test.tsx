import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MembershipNavItem } from "./MembershipNavItem";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/ProfileMembershipBanner", () => ({
    ProfileMembershipBanner: () => <div>membership-banner-content</div>,
}));

const renderItem = () => render(
    <MemoryRouter>
        <MembershipNavItem />
    </MemoryRouter>,
);

/**
 * GS-149: при наведении курсора на пункт меню «Членство» в десктопной
 * шапке — попап с тем же баннером, что на /profile/info (GS-170). Клик
 * по самому пункту меню по-прежнему ведёт на /membership.
 */
describe("MembershipNavItem", () => {
    it("ссылка «Членство» ведёт на /membership независимо от попапа", () => {
        renderItem();

        const link = screen.getByRole("link", { name: "Членство" });
        expect(link).toHaveAttribute("href", expect.stringContaining("/membership"));
    });

    it("попап скрыт до наведения курсора", () => {
        const { container } = renderItem();

        const popup = container.querySelector(".popup");
        expect(popup).not.toHaveClass("open");
    });

    it("наведение курсора открывает попап, уход курсора закрывает", () => {
        const { container } = renderItem();

        const wrapper = container.querySelector(".wrapper");
        const popup = container.querySelector(".popup");

        fireEvent.mouseEnter(wrapper!);
        expect(popup).toHaveClass("open");

        fireEvent.mouseLeave(wrapper!);
        expect(popup).not.toHaveClass("open");
    });
});

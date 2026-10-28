import React from "react";
import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MobileHeader from "./MobileHeader";

let authDataMock: object | undefined;
type MembershipMock = { isActive: boolean; endDate: string; tariff: { category: string } };
let membershipMock: MembershipMock | undefined;

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, opts?: Record<string, unknown> | string) => (
            typeof opts === "object" && opts !== null
                ? `${key}:${JSON.stringify(opts)}`
                : key
        ),
    }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/ChangeLanguage", () => ({
    ChangeLanguage: () => <div />,
}));

vi.mock("@/shared/hooks/redux", () => ({
    useAppDispatch: () => vi.fn(),
    useAppSelector: () => authDataMock,
}));

vi.mock("@/store/api/membershipApi", () => ({
    useGetCurrentAllMembershipsQuery: (_: unknown, opts: { skip: boolean }) => (
        { data: opts.skip || !membershipMock ? undefined : [membershipMock] }
    ),
}));

const renderHeader = () => render(
    <MemoryRouter>
        <MobileHeader />
    </MemoryRouter>,
);

/** Разгрузка мобильного меню 28.10. */
describe("MobileHeader", () => {
    beforeEach(() => {
        authDataMock = undefined;
        membershipMock = undefined;
    });

    it("кнопка меню — настоящая кнопка с подписью и состоянием", () => {
        renderHeader();
        const burger = screen.getByRole("button", { name: "main.welcome.header.menu" });
        expect(burger.getAttribute("aria-expanded")).toBe("false");
        fireEvent.click(burger);
        expect(burger.getAttribute("aria-expanded")).toBe("true");
    });

    it("гостю вместо карточек тарифов — одна строка с ценой", () => {
        renderHeader();
        expect(screen.getByText(/main\.welcome\.header\.membership-from:.*990/)).toBeTruthy();
        expect(screen.queryByText(/Оформить членство/)).toBeNull();
    });

    it("при активном членстве показывает срок", () => {
        authDataMock = { token: "x" };
        membershipMock = { isActive: true, endDate: "2027-01-31", tariff: { category: "REGULAR" } };
        renderHeader();
        expect(screen.getByText(/main\.welcome\.header\.membership-active/)).toBeTruthy();
    });

    it("есть ссылки на экспедиции и международное волонтёрство, как на компьютере", () => {
        renderHeader();
        const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
        expect(hrefs).toContain("https://expedition.goodsurfing.org/");
        expect(hrefs).toContain("https://international.goodsurfing.org/");
    });
});

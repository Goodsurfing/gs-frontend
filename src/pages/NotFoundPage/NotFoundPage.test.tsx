import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import NotFoundPage from "./NotFoundPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// MainPageLayout — общий каркас (шапка/футер), тянет за собой Auth/i18n-
// контекст, не предмет этого теста.
vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("NotFoundPage", () => {
    it("показывает текст 404 и ссылку на главную с текущей локалью", () => {
        renderWithProviders(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>,
        );

        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText(/не существует/i)).toBeInTheDocument();

        const link = screen.getByRole("link", { name: /на главную/i });
        expect(link).toHaveAttribute("href", "/ru/");
    });
});

import React from "react";
import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import PaymentSecurityPolicyPage from "./PaymentSecurityPolicyPage";

const localeState = { locale: "ru" };
vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => localeState,
}));

vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const NOTICE = /неофициальный перевод/i;

const renderPage = () => renderWithProviders(
    <MemoryRouter>
        <PaymentSecurityPolicyPage />
    </MemoryRouter>,
);

describe("PaymentSecurityPolicyPage", () => {
    beforeEach(() => {
        localeState.locale = "ru";
    });

    it("на русском — оригинальный текст без плашки о переводе", () => {
        renderPage();

        expect(screen.getByText(/протокол TLS 1\.2/)).toBeInTheDocument();
        expect(screen.queryByText(NOTICE)).not.toBeInTheDocument();
    });

    it("на английском — перевод и плашка, что юридическую силу имеет русская версия", () => {
        localeState.locale = "en";
        renderPage();

        expect(screen.getByText(/TLS 1\.2 protocol/)).toBeInTheDocument();
        expect(screen.queryByText(/протокол TLS/)).not.toBeInTheDocument();
        expect(screen.getByRole("note")).toHaveTextContent(NOTICE);
    });

    it("на испанском — испанский перевод", () => {
        localeState.locale = "es";
        renderPage();

        expect(screen.getByText(/protocolo TLS 1\.2/)).toBeInTheDocument();
        expect(screen.getByRole("note")).toBeInTheDocument();
    });
});

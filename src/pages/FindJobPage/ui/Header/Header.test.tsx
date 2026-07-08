import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { Header } from "./Header";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Регресс-тест для PR gs-frontend#349 (v0.1.26): кнопка "Найти работу" на
 * /find-job вела на /offers-map?category=paid_work — фильтр на offers-map
 * принимает только числовые ID категорий (Number("paid_work")=NaN,
 * отбрасывалось). Должна вести на реальный numeric ID категории "Оплачиваемая
 * работа" (13).
 */
describe("FindJobPage Header", () => {
    it('кнопка "Найти работу" ведёт на числовой ID категории, а не на строковый слаг', () => {
        renderWithProviders(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        const link = screen.getByText("Найти работу").closest("a");
        expect(link).toHaveAttribute("href", "/ru/offers-map?category=13");
        expect(link?.getAttribute("href")).not.toContain("paid_work");
    });
});

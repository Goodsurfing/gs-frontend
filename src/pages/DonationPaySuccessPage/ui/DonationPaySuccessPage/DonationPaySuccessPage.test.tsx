import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import DonationPaySuccessPage from "./DonationPaySuccessPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// MainPageLayout — общий каркас (шапка/футер), не предмет этого теста, а его
// собственная шапка тянет за собой Auth/i18n-контекст. Мокаем, чтобы
// проверять только контент карточки успеха.
vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

/**
 * Регресс-guard для row 76: страница успешной оплаты пожертвования — это
 * отдельный компонент DonationPaySuccessPage (коммит f32865c7), НЕ
 * переиспользующий членский PaymentSuccessPage. Раньше был баг, что после
 * оплаты сбора показывался текст про членство — фиксируем корректный текст,
 * чтобы при будущем рефакторинге компоненты снова случайно не схлопнули.
 */
describe("DonationPaySuccessPage", () => {
    it("показывает текст про пожертвование, а не про членство", () => {
        renderWithProviders(
            <MemoryRouter>
                <DonationPaySuccessPage />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Спасибо за пожертвование/i)).toBeInTheDocument();
        expect(screen.queryByText(/членств/i)).not.toBeInTheDocument();
    });
});

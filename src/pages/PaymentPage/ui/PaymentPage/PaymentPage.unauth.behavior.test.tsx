import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import {
    MemoryRouter, Routes, Route, useLocation,
} from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import PaymentPage from "./PaymentPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: false, myProfile: null }),
}));

const LocationDisplay = () => {
    const location = useLocation();
    return (
        <div data-testid="location">
            {location.pathname}
            {location.search}
        </div>
    );
};

/**
 * Регресс-guard: раньше неавторизованный юзер терял выбранный тариф —
 * редирект на /signin шёл без next/nextId, а после логина AuthByEmail
 * уводил на дефолтную страницу профиля вместо возврата к оплате.
 */
describe("PaymentPage — редирект на signin для неавторизованного юзера", () => {
    it("сохраняет tariffCode через next/nextId, чтобы после логина вернуться к оплате", async () => {
        // PaymentPage монтируется через <Route>, как в реальном роутере
        // приложения — после navigate() на /signin компонент размонтируется
        // и не перечитывает searchParams уже сброшенной локации (иначе
        // tariffCode откатывался бы к дефолту на втором рендере).
        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment?tariff=host_4990"]}>
                <Routes>
                    <Route path="/:locale/payment" element={<PaymentPage />} />
                    <Route path="*" element={null} />
                </Routes>
                <LocationDisplay />
            </MemoryRouter>,
        );

        expect(await screen.findByTestId("location")).toHaveTextContent(
            "/ru/signin?next=payment&nextId=host_4990",
        );
    });
});

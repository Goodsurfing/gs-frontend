import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import {
    MemoryRouter, Routes, Route, useLocation,
} from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { setupStore } from "@/store/store";
import { userActions } from "@/entities/User";
import PaymentPage from "./PaymentPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const auth = vi.hoisted(() => ({ myProfile: null as null | { id: string } }));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: false, myProfile: auth.myProfile }),
}));

/** Стор после старта приложения: сессия прочитана из localStorage. */
const initedStore = (withSession: boolean) => {
    localStorage.clear();
    if (withSession) {
        localStorage.setItem("user", JSON.stringify({ username: "u@test.com" }));
        localStorage.setItem("token", JSON.stringify("access"));
        localStorage.setItem("mercureToken", JSON.stringify("mercure"));
        localStorage.setItem("roles", JSON.stringify(["ROLE_USER"]));
    }
    const store = setupStore();
    store.dispatch(userActions.initAuthData());
    return store;
};

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
            <MemoryRouter initialEntries={["/payment?tariff=host_4990"]}>
                <Routes>
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="*" element={null} />
                </Routes>
                <LocationDisplay />
            </MemoryRouter>,
            { store: initedStore(false) },
        );

        expect(await screen.findByTestId("location")).toHaveTextContent(
            "/signin?next=payment&nextId=host_4990",
        );
    });

    /**
     * Вошедший пользователь, у которого профиль ещё грузится (прямой заход по
     * ссылке, быстрый клик на /membership), не должен улетать на форму входа:
     * раньше страница смотрела на isAuth/myProfile, а они появляются позже
     * первого рендера (e2e «международный клуб» падал через раз).
     */
    it("вошедшего пользователя с недогруженным профилем не уводит на вход", async () => {
        auth.myProfile = null;
        renderWithProviders(
            <MemoryRouter initialEntries={["/payment?tariff=international_5000"]}>
                <Routes>
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="*" element={null} />
                </Routes>
                <LocationDisplay />
            </MemoryRouter>,
            { store: initedStore(true) },
        );

        await new Promise((resolve) => { setTimeout(resolve, 50); });
        expect(screen.getByTestId("location")).toHaveTextContent("/payment?tariff=international_5000");
    });

    it("пока сессия не прочитана из хранилища, никуда не уводит", async () => {
        auth.myProfile = null;
        renderWithProviders(
            <MemoryRouter initialEntries={["/payment?tariff=volunteer_990"]}>
                <Routes>
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="*" element={null} />
                </Routes>
                <LocationDisplay />
            </MemoryRouter>,
            { store: setupStore() },
        );

        await new Promise((resolve) => { setTimeout(resolve, 50); });
        expect(screen.getByTestId("location")).toHaveTextContent("/payment?tariff=volunteer_990");
    });
});

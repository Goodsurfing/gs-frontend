import React from "react";
import {
    describe, it, expect, vi, beforeEach, afterEach,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { setupStore } from "@/store/store";
import { userActions } from "@/entities/User";
import { server } from "@/mocks/server";
import PaymentPage from "./PaymentPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: true, myProfile: { id: "u1", email: "u@test.com" } }),
}));

const CHECKOUT_URL = "*/api/v1/membership/checkout";

/** Стор с сессией из localStorage — как после старта приложения у вошедшего пользователя. */
const sessionStore = () => {
    localStorage.setItem("user", JSON.stringify({ username: "u@test.com" }));
    localStorage.setItem("token", JSON.stringify("access"));
    localStorage.setItem("mercureToken", JSON.stringify("mercure"));
    localStorage.setItem("roles", JSON.stringify(["ROLE_USER"]));
    const store = setupStore();
    store.dispatch(userActions.initAuthData());
    return store;
};

/**
 * Поведенческий тест поверх старого PaymentPage.regression.test.ts
 * (source-inspection): здесь реально монтируем компонент и гоняем через
 * MSW настоящий цикл запрос/ответ, а не проверяем текст исходника.
 */
describe("PaymentPage — реальное поведение чекаута", () => {
    let originalLocation: Location;

    beforeEach(() => {
        originalLocation = window.location;
        // window.location.href = '...' в jsdom не поддерживается как
        // настоящая навигация — подменяем на объект с шпионским сеттером,
        // чтобы проверить факт редиректа, не пытаясь реально перейти по URL.
        // @ts-expect-error — намеренно упрощённый мок под тест
        delete window.location;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).location = {
            href: "",
            replace(url: string) { this.href = url; this.replaced = url; },
        };
    });

    afterEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).location = originalLocation;
    });

    it("при успешном чекауте редиректит на paymentUrl от бэка", async () => {
        server.use(
            rest.post(CHECKOUT_URL, (req, res, ctx) => res(ctx.status(200), ctx.json({
                membershipId: "m1",
                paymentId: "p1",
                paymentUrl: "https://yookassa.ru/pay/p1",
                status: "PENDING",
                tariffCode: "volunteer_990",
            }))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment?tariff=volunteer_990"]}>
                <PaymentPage />
            </MemoryRouter>,
            { store: sessionStore() },
        );

        await waitFor(() => expect(window.location.href).toBe("https://yookassa.ru/pay/p1"));
        // replace, а не переход с записью в историю: иначе «Назад» с ЮKassa
        // снова открывает /payment, создаёт новый платёж и уводит обратно
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((window.location as any).replaced).toBe("https://yookassa.ru/pay/p1");
    });

    /**
     * Регресс-guard для row 95 ("После нажатия на любую из кнопок оплаты,
     * просто возвращает в начало страницы") — 409 раньше молча уводил на
     * страницу членства без единого сообщения.
     */
    it("на 409 (уже есть активное членство) показывает сообщение, а не молча возвращает назад", async () => {
        server.use(
            rest.post(CHECKOUT_URL, (req, res, ctx) => res(ctx.status(409), ctx.json({
                detail: "MembershipAlreadyActive",
            }))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment?tariff=volunteer_990"]}>
                <PaymentPage />
            </MemoryRouter>,
            { store: sessionStore() },
        );

        expect(await screen.findByText(/уже есть активное членство/i)).toBeInTheDocument();
        expect(window.location.href).toBe("");
    });

    it("на 502 показывает дружелюбное сообщение о недоступности провайдера", async () => {
        server.use(
            rest.post(CHECKOUT_URL, (req, res, ctx) => res(ctx.status(502), ctx.json({
                detail: "",
            }))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment?tariff=volunteer_990"]}>
                <PaymentPage />
            </MemoryRouter>,
            { store: sessionStore() },
        );

        expect(await screen.findByText(/сервис оплаты временно недоступен/i)).toBeInTheDocument();
    });

    it("показывает detail из ответа бэка для прочих ошибок", async () => {
        server.use(
            rest.post(CHECKOUT_URL, (req, res, ctx) => res(ctx.status(400), ctx.json({
                detail: "tariffCode: This value should not be blank.",
            }))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment?tariff=volunteer_990"]}>
                <PaymentPage />
            </MemoryRouter>,
            { store: sessionStore() },
        );

        expect(await screen.findByText(/tariffCode: This value should not be blank/i)).toBeInTheDocument();
    });
});

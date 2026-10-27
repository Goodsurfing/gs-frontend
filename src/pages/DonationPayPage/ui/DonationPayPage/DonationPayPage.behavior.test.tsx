import React from "react";
import {
    describe, it, expect, vi, beforeEach, afterEach,
} from "vitest";
import {
    screen, waitFor, fireEvent,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import DonationPayPage from "./DonationPayPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: true, myProfile: { id: "u1", email: "u@test.com" } }),
}));

const FUNDRAISE_ID = "0199aaaa-0000-7000-8000-000000000001";
const DONATION_URL = "*/api/v1/donation";

const renderPage = () => renderWithProviders(
    <MemoryRouter initialEntries={[`/ru/donation/${FUNDRAISE_ID}/pay`]}>
        <Routes>
            <Route path="/ru/donation/:id/pay" element={<DonationPayPage />} />
        </Routes>
    </MemoryRouter>,
);

const submit = () => fireEvent.submit(screen.getByRole("button", { name: /Поддержать/ }).closest("form")!);

describe("DonationPayPage — оплата пожертвования", () => {
    let originalLocation: Location;
    let donationRequests: unknown[];

    beforeEach(() => {
        donationRequests = [];
        originalLocation = window.location;
        // @ts-expect-error — подменяем location, чтобы поймать редирект на оплату
        delete window.location;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).location = { href: "" };

        server.use(
            rest.get(`*/api/v1/fundraise/${FUNDRAISE_ID}`, (req, res, ctx) => res(ctx.json({
                id: FUNDRAISE_ID,
                name: "Тестовый сбор",
                image: null,
            }))),
        );
    });

    afterEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).location = originalLocation;
    });

    it("отправляет сумму и сбор, затем уводит на страницу оплаты ЮКассы", async () => {
        server.use(
            rest.post(DONATION_URL, async (req, res, ctx) => {
                donationRequests.push(await req.json());
                return res(ctx.status(201), ctx.json({
                    donationId: "d1",
                    paymentUrl: "https://yoomoney.ru/checkout/payments/v2/contract?orderId=abc",
                    status: "pending",
                }));
            }),
        );
        renderPage();
        await screen.findByRole("button", { name: /Поддержать/ });

        submit();

        await waitFor(() => {
            expect(window.location.href).toBe("https://yoomoney.ru/checkout/payments/v2/contract?orderId=abc");
        });
        expect(donationRequests).toEqual([{ fundraiseId: FUNDRAISE_ID, amount: 1500, isAnonymous: false }]);
    });

    it("сумму меньше 100 ₽ не отправляет и показывает ошибку", async () => {
        server.use(
            rest.post(DONATION_URL, async (req, res, ctx) => {
                donationRequests.push(await req.json());
                return res(ctx.status(201), ctx.json({}));
            }),
        );
        renderPage();
        await screen.findByRole("button", { name: /Поддержать/ });

        fireEvent.change(screen.getByLabelText("Другая сумма, ₽"), { target: { value: "99" } });
        submit();

        expect(await screen.findByText("Минимальная сумма пожертвования — 100 ₽")).toBeInTheDocument();
        expect(donationRequests).toEqual([]);
        expect(window.location.href).toBe("");
    });

    it("если ЮКасса недоступна (502) — честно говорит, что сервис оплаты недоступен", async () => {
        server.use(
            rest.post(DONATION_URL, (req, res, ctx) => res(ctx.status(502), ctx.json({
                type: "payment_provider_unavailable",
                title: "Payment provider unavailable",
            }))),
        );
        renderPage();
        await screen.findByRole("button", { name: /Поддержать/ });

        submit();

        expect(await screen.findByText("Сервис оплаты временно недоступен Попробуйте позже")).toBeInTheDocument();
        expect(window.location.href).toBe("");
    });

    it("при прочей ошибке — общее сообщение и без редиректа", async () => {
        server.use(
            rest.post(DONATION_URL, (req, res, ctx) => res(ctx.status(400), ctx.json(["amount: invalid"]))),
        );
        renderPage();
        await screen.findByRole("button", { name: /Поддержать/ });

        submit();

        expect(await screen.findByText("Произошла ошибка при создании платежа")).toBeInTheDocument();
        expect(window.location.href).toBe("");
    });
});

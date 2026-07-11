import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import PaymentSuccessPage from "./PaymentSuccessPage";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/widgets/MainPageLayout", () => ({
    MainPageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ isAuth: true, myProfile: { id: "u1", email: "u@test.com", firstName: "Вася" } }),
}));

const MEMBERSHIP_CURRENT_URL = "*/api/v1/membership/current";
const PAYMENT_STATUS_URL = "*/api/v1/payments/:id";

function mockMembershipCurrent(tariffCode: string | null) {
    server.use(
        rest.get(MEMBERSHIP_CURRENT_URL, (req, res, ctx) => res(ctx.status(200), ctx.json(
            tariffCode
                ? {
                    membershipId: "m1",
                    status: "ACTIVE",
                    isActive: true,
                    startDate: "2026-01-01T00:00:00Z",
                    endDate: "2026-12-31T23:59:59Z",
                    tariff: { code: tariffCode },
                }
                : {
                    membershipId: null,
                    status: null,
                    isActive: false,
                    startDate: null,
                    endDate: null,
                    tariff: null,
                },
        ))),
    );
}

function mockPaymentStatus(status: string, tariffCode: string | null) {
    server.use(
        rest.get(PAYMENT_STATUS_URL, (req, res, ctx) => res(ctx.status(200), ctx.json({
            id: "p1",
            status,
            amount: "990.00",
            currency: "RUB",
            paidAt: status === "SUCCESS" ? "2026-07-11T10:00:00Z" : null,
            tariffCode,
        }))),
    );
}

/**
 * Регресс-guard: до фикса payment.tariffCode отсутствовал в ответе бэка,
 * а страница угадывала купленный тариф по membership.tariff.code — что
 * стало неоднозначным, когда у юзера может быть больше одного активного
 * членства одновременно (см. PaymentSuccessPage.regression.test.ts —
 * тот проверяет исходник, этот — реальное поведение при монтировании).
 */
describe("PaymentSuccessPage — реальное поведение по payment.tariffCode", () => {
    it("международный тариф: показывает international-контент по payment.tariffCode, даже если membership другой", async () => {
        mockMembershipCurrent("host_4990"); // у юзера уже было другое активное членство
        mockPaymentStatus("SUCCESS", "international_5000");

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment/success?payment_id=p1"]}>
                <PaymentSuccessPage />
            </MemoryRouter>,
        );

        expect(await screen.findByText(/международный клуб/i)).toBeInTheDocument();
        expect(screen.queryByText(/можете пользоваться всеми возможностями портала/i)).not.toBeInTheDocument();
    });

    it("host-тариф: показывает host-контент и CTA на публикацию вакансий", async () => {
        mockMembershipCurrent("host_4990");
        mockPaymentStatus("SUCCESS", "host_4990");

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment/success?payment_id=p1"]}>
                <PaymentSuccessPage />
            </MemoryRouter>,
        );

        expect(await screen.findByText(/перейти к объявлениям/i)).toBeInTheDocument();
    });

    it("volunteer-тариф (дефолт): показывает контент про поиск путешествий", async () => {
        mockMembershipCurrent("volunteer_990");
        mockPaymentStatus("SUCCESS", "volunteer_990");

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment/success?payment_id=p1"]}>
                <PaymentSuccessPage />
            </MemoryRouter>,
        );

        expect(await screen.findByText(/искать путешествия/i)).toBeInTheDocument();
    });

    it("пока payment.status не SUCCESS — показывает прелоадер, а не контент", async () => {
        mockMembershipCurrent(null);
        mockPaymentStatus("PENDING", null);

        const { container } = renderWithProviders(
            <MemoryRouter initialEntries={["/ru/payment/success?payment_id=p1"]}>
                <PaymentSuccessPage />
            </MemoryRouter>,
        );

        await waitFor(() => expect(container.querySelector(".preloader")).not.toBeNull());
        expect(screen.queryByText(/искать путешествия/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/международный клуб/i)).not.toBeInTheDocument();
    });
});

import React from "react";
import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { Profile } from "@/entities/Profile";
import { Chat } from "./Chat";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/routes/model/guards/AuthProvider", () => ({
    useAuth: () => ({ mercureToken: null }),
}));

vi.mock("@/app/providers/MessengerProvider", () => ({
    useMessenger: () => ({ onReadMessage: vi.fn() }),
}));

const MY_PROFILE = {
    id: "u1", firstName: "Иван", lastName: "Иванов", image: null,
} as unknown as Profile;

// Точная копия структуры реальной вакансии 7205 (row: "почему кнопка
// неактивна, если я подал заявку на участие") — у неё ровно один период,
// совпадающий с допустимой длительностью, то есть даты по факту не выбираются.
const OFFER_RESPONSE_FIXED_DATES = {
    id: 7205,
    status: "active",
    averageRating: 0,
    reviewsCount: 0,
    acceptedApplicationsCount: 0,
    where: { address: "Республика Алтай" },
    description: { title: "Школа фотографа", shortDescription: "Кратко", description: "Полное описание" },
    when: {
        isFullYearAcceptable: false,
        isApplicableAtTheEnd: false,
        durationMinDays: 7,
        durationMaxDays: 8,
        applicationEndDate: "09.08.2026",
        periods: [{ start: "20.09.2026", end: "27.09.2026" }],
    },
};

const OFFER_RESPONSE_NO_FIXED_DATES = {
    ...OFFER_RESPONSE_FIXED_DATES,
    when: {
        ...OFFER_RESPONSE_FIXED_DATES.when,
        isFullYearAcceptable: true,
        periods: [],
    },
};

describe("Chat — заявка на вакансию с фиксированными датами", () => {
    beforeEach(() => {
        server.use(
            rest.get("*/chats/:chatId", (req, res, ctx) => res(ctx.status(404))),
            rest.get("*/chats/:chatId/messages", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );
    });

    it("даты у вакансии единственно возможные — подставляются сами, строка про выбор дат не показывается", async () => {
        server.use(
            rest.get("*/vacancy/:id", (req, res, ctx) => res(ctx.status(200), ctx.json(OFFER_RESPONSE_FIXED_DATES))),
        );

        renderWithProviders(
            <MemoryRouter>
                <Chat
                    id="create"
                    offerId="7205"
                    onBackButton={() => {}}
                    locale="ru"
                    myProfileData={MY_PROFILE}
                />
            </MemoryRouter>,
        );

        await screen.findByText("Школа фотографа");

        expect(screen.queryByText("Укажите даты, чтобы отправить заявку")).not.toBeInTheDocument();
        expect(await screen.findByDisplayValue("20-09-2026")).toBeInTheDocument();
        expect(await screen.findByDisplayValue("27-09-2026")).toBeInTheDocument();
        // TermsApplication дублировал похожую подсказку своей собственной строкой —
        // при фиксированных датах она тоже не должна показываться.
        expect(screen.queryByText("Укажите в какие даты вы хотите участвовать")).not.toBeInTheDocument();
    });

    it("у вакансии нет фиксированных дат — просит их выбрать, поля дат пустые", async () => {
        server.use(
            rest.get("*/vacancy/:id", (req, res, ctx) => res(ctx.status(200), ctx.json(OFFER_RESPONSE_NO_FIXED_DATES))),
        );

        renderWithProviders(
            <MemoryRouter>
                <Chat
                    id="create"
                    offerId="7205"
                    onBackButton={() => {}}
                    locale="ru"
                    myProfileData={MY_PROFILE}
                />
            </MemoryRouter>,
        );

        await screen.findByText("Школа фотографа");

        expect(await screen.findByText("Укажите даты, чтобы отправить заявку")).toBeInTheDocument();
        expect(screen.queryByDisplayValue("20-09-2026")).not.toBeInTheDocument();
        expect(screen.getByText("Укажите в какие даты вы хотите участвовать")).toBeInTheDocument();
    });
});

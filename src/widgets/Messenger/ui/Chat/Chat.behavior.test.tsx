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

const OFFER_RESPONSE = {
    id: 7182,
    status: "active",
    averageRating: 0,
    reviewsCount: 0,
    acceptedApplicationsCount: 0,
    where: { address: "Мурманская область" },
    description: { title: "Тестовая вакансия", shortDescription: "Кратко", description: "Полное описание" },
};

/**
 * Регресс-guard: страница «Вы подали заявку» (`isChatCreate`, id === "create")
 * дёргала GET /chats/create и GET /chats/create/messages с буквальным
 * "create" вместо настоящего chatId — второй запрос ронял бэкенд 500-кой
 * (Doctrine не мог привести "create" к int-PK чата). Chat.tsx теперь
 * передаёт в оба хука `undefined` вместо строкового id, пока заявка не
 * подтверждена.
 */
describe("Chat — не дёргает /chats/create* пока заявка не подтверждена", () => {
    let chatRequestPaths: string[] = [];

    beforeEach(() => {
        chatRequestPaths = [];
        server.use(
            rest.get("*/vacancy/:id", (req, res, ctx) => res(ctx.status(200), ctx.json(OFFER_RESPONSE))),
            rest.get("*/chats/:chatId", (req, res, ctx) => {
                chatRequestPaths.push(req.url.pathname);
                return res(ctx.status(404));
            }),
            rest.get("*/chats/:chatId/messages", (req, res, ctx) => {
                chatRequestPaths.push(req.url.pathname);
                return res(ctx.status(200), ctx.json([]));
            }),
        );
    });

    it("не отправляет GET /chats/create и /chats/create/messages", async () => {
        renderWithProviders(
            <MemoryRouter>
                <Chat
                    id="create"
                    offerId="7182"
                    onBackButton={() => {}}
                    locale="ru"
                    myProfileData={MY_PROFILE}
                />
            </MemoryRouter>,
        );

        await screen.findByText("Тестовая вакансия");

        expect(chatRequestPaths).toHaveLength(0);
    });
});

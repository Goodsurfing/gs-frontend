import React from "react";
import {
    describe, it, expect, beforeEach,
} from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { rest } from "msw";
import { server } from "@/mocks/server";
import { setupStore } from "@/store/store";
import { useGetChatMessages } from "./useGetChatMessages";

/**
 * Регресс-guard: страница «Вы подали заявку» (`/messenger/create/{offerId}`)
 * раньше дёргала GET /chats/create/messages с буквальным ID "create" вместо
 * настоящего chatId — бэкенд падал 500 (Doctrine не мог привести "create" к
 * int-PK чата). Хук должен пропускать запрос, когда chatId не передан
 * (Chat.tsx теперь передаёт undefined вместо "create" на этой странице).
 */
describe("useGetChatMessages — пропуск запроса для create-заглушки", () => {
    let requestedUrls: string[] = [];

    beforeEach(() => {
        requestedUrls = [];
        server.use(
            rest.get("*/chats/:chatId/messages", (req, res, ctx) => {
                requestedUrls.push(req.url.pathname);
                return res(ctx.status(200), ctx.json([]));
            }),
        );
    });

    const renderWithStore = (chatId: string | undefined) => renderHook(
        () => useGetChatMessages(chatId, null, "profile-1"),
        {
            wrapper: ({ children }) => (
                <Provider store={setupStore()}>{children}</Provider>
            ),
        },
    );

    it("chatId не передан — запрос к /chats/*/messages не улетает", async () => {
        renderWithStore(undefined);

        await new Promise((resolve) => { setTimeout(resolve, 50); });
        expect(requestedUrls).toHaveLength(0);
    });

    it("реальный chatId — запрос улетает как обычно", async () => {
        renderWithStore("42");

        await waitFor(() => {
            expect(requestedUrls).toContain("/api/v1/chats/42/messages");
        });
    });
});

import React from "react";
import {
    describe, it, expect, beforeEach,
} from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { rest } from "msw";
import { server } from "@/mocks/server";
import { setupStore } from "@/store/store";
import { useGetChatMessages } from "./useGetChatMessages";
import { useCreateMessageMutation } from "../api/chatApi";

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

/**
 * Отправленное сообщение появляется в открытом чате только через
 * Mercure-подписку (EventSource) — у createMessage нет ни оптимистичного
 * добавления в список, ни invalidatesTags-страховки не было. Если SSE-пуш
 * задержится/оборвётся, отправитель не увидит собственное сообщение без
 * перезагрузки страницы. Проверяем, что отправка сообщения форсирует
 * рефетч списка сообщений независимо от Mercure.
 */
describe("createMessage — рефетч списка сообщений после отправки", () => {
    it("успешная отправка инвалидирует и обновляет getMessagesByChatId", async () => {
        let callCount = 0;
        server.use(
            rest.get("*/chats/:chatId/messages", (req, res, ctx) => {
                callCount += 1;
                if (callCount === 1) {
                    return res(ctx.status(200), ctx.json([
                        {
                            id: 1, author: "/api/v1/users/other", text: "Привет", createdAt: "2026-08-06T10:00:00+00:00", viewed: true, applicationForm: null,
                        },
                    ]));
                }
                return res(ctx.status(200), ctx.json([
                    {
                        id: 1, author: "/api/v1/users/other", text: "Привет", createdAt: "2026-08-06T10:00:00+00:00", viewed: true, applicationForm: null,
                    },
                    {
                        id: 2, author: "/api/v1/users/me", text: "Живой ответ", createdAt: "2026-08-06T10:01:00+00:00", viewed: true, applicationForm: null,
                    },
                ]));
            }),
            rest.post("*/messages", (req, res, ctx) => res(
                ctx.status(201),
                ctx.json({
                    id: 2, author: "/api/v1/users/me", text: "Живой ответ", chat: "/api/v1/chats/42", createdAt: "2026-08-06T10:01:00+00:00", applicationForm: null, attachments: [], readByUserIds: [],
                }),
            )),
        );

        const store = setupStore();
        const messagesHook = renderHook(
            () => useGetChatMessages("42", null, "profile-1"),
            { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> },
        );
        const mutationHook = renderHook(
            () => useCreateMessageMutation(),
            { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> },
        );

        await waitFor(() => {
            expect(messagesHook.result.current.messages).toHaveLength(1);
        });

        const [createMessage] = mutationHook.result.current;
        await act(async () => {
            await createMessage({ chat: "/api/v1/chats/42", text: "Живой ответ", attachments: [] }).unwrap();
        });

        await waitFor(() => {
            expect(messagesHook.result.current.messages).toHaveLength(2);
        });
        expect(callCount).toBeGreaterThanOrEqual(2);
    });
});

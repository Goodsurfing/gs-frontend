import {
    describe, it, expect, vi, beforeEach, afterEach,
} from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useGetChatListData } from "./useGetChatListData";
import { MessageType } from "@/entities/Messenger";

/**
 * Регресс-guard для row 116: непрочитанные чаты "моргали" и пропадали из
 * видимой области списка при активной переписке. Причина — на КАЖДОЕ
 * сообщение (в любом чате) дергался полный сетевой fetchChats() +
 * пересортировка всего списка, вместо точечного обновления.
 * applyIncomingMessage обновляет состояние локально, без сети.
 */
describe("useGetChatListData.applyIncomingMessage", () => {
    const initialChats = [
        { id: 1, lastMessage: undefined, otherParticipants: [], countUnreadMessages: 0 },
        {
            id: 2,
            lastMessage: {
                id: 1,
                text: "привет",
                attachments: [],
                createdAt: "2026-07-01T10:00:00Z",
                chat: "https://api.goodsurfing.org/api/v1/chats/2",
                readByUserIds: [],
                author: { id: "user-1" },
            },
            otherParticipants: [],
            countUnreadMessages: 3,
        },
    ];

    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            json: () => Promise.resolve(initialChats),
        }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    const makeMessage = (chatId: number, id: number): MessageType => ({
        id,
        author: "user-1",
        text: "hello",
        attachments: [],
        createdAt: "2026-07-09T10:00:00Z",
        chat: `https://api.goodsurfing.org/api/v1/chats/${chatId}`,
        readByUserIds: [],
    });

    it("обновляет lastMessage и увеличивает countUnreadMessages без сетевого запроса", async () => {
        const { result } = renderHook(() => useGetChatListData("token", "mercure-token"));

        await waitFor(() => expect(result.current.chatsList).toHaveLength(2));
        const fetchCallsBefore = (global.fetch as ReturnType<typeof vi.fn>).mock.calls.length;

        act(() => {
            result.current.applyIncomingMessage(makeMessage(2, 999));
        });

        const updatedChat = result.current.chatsList.find((c) => c.id === 2);
        expect(updatedChat?.countUnreadMessages).toBe(4);
        expect(updatedChat?.lastMessage?.id).toBe(999);

        // Точечное обновление не должно было вызывать новый fetch
        expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls.length).toBe(fetchCallsBefore);
    });

    it("не меняет список для сообщения из чата, которого ещё нет локально", async () => {
        const { result } = renderHook(() => useGetChatListData("token", "mercure-token"));

        await waitFor(() => expect(result.current.chatsList).toHaveLength(2));

        act(() => {
            result.current.applyIncomingMessage(makeMessage(999, 1));
        });

        expect(result.current.chatsList).toHaveLength(2);
        expect(result.current.chatsList.every((c) => c.id === 1 || c.id === 2)).toBe(true);
    });
});

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URL, browserApi } from "@/lib/browserApi";
import { type ApplicationStatus, applyIncomingMessage, type Chat, type ChatMessage, CHATS_PER_PAGE, fetchAllChats, idFromIri, mergeMessages, sortChats } from "@/lib/messenger";
import { storageGet } from "@/lib/safeStorage";

/** Токен Mercure старого SPA (localStorage, JSON-строкой); без него — опрос сервера */
const mercureToken = (): string | null => {
    try {
        const value: unknown = JSON.parse(storageGet("mercureToken") ?? "null");
        return typeof value === "string" && value ? value : null;
    } catch {
        return null;
    }
};

/** Без Mercure (нет токена, соединение не открылось) список и чат перезапрашиваются с этим шагом */
const POLL_MS = 20_000;

/**
 * Новые сообщения в реальном времени: одна подписка Mercure на все чаты
 * вошедшего (тема с шаблоном {?chat}, как MessengerProvider старого фронта).
 * Без токена Mercure вызывается onPoll раз в 20 секунд.
 */
export function useLiveMessages(profileId: string | undefined, onMessage: (message: ChatMessage) => void, onPoll: () => void) {
    const handler = useRef(onMessage);
    const poll = useRef(onPoll);
    useEffect(() => {
        handler.current = onMessage;
        poll.current = onPoll;
    }, [onMessage, onPoll]);

    useEffect(() => {
        if (!profileId) return;
        const token = mercureToken();
        if (!token || typeof EventSource === "undefined") {
            const timer = window.setInterval(() => poll.current(), POLL_MS);
            return () => window.clearInterval(timer);
        }
        const url = new URL(`${API_URL}/.well-known/mercure`);
        url.searchParams.append("topic", `${API_URL}/api/v1/users/${profileId}/messages/{?chat}`);
        url.searchParams.append("authorization", token);
        const source = new EventSource(url);
        source.addEventListener("messageOnChat", (event) => {
            try {
                handler.current(JSON.parse((event as MessageEvent<string>).data) as ChatMessage);
            } catch {
                // Битое событие — пропускаем
            }
        });
        return () => source.close();
    }, [profileId]);
}

/** Список чатов вошедшего с поиском и фильтром по статусу заявки */
export function useChatList(token: string | undefined, enabled: boolean) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<ApplicationStatus | null>(null);

    const reload = useCallback(async () => {
        if (!enabled) return;
        const query: Record<string, string | number> = { itemsPerPage: CHATS_PER_PAGE };
        if (search) query.search = search;
        if (status) query.status = status;
        const all = await fetchAllChats(async (page) => {
            const result = await browserApi(token)
                .GET("/api/v1/personal/chats", { params: { query: { ...query, page } as never } })
                .catch(() => null);
            return Array.isArray(result?.data) ? (result.data as Chat[]) : null;
        });
        if (all) setChats(sortChats(all));
        setLoaded(true);
    }, [enabled, search, status, token]);

    useEffect(() => {
        // Загрузка данных при смене поиска и фильтра
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void reload();
    }, [reload]);

    const applyMessage = useCallback((message: ChatMessage) => {
        setChats((current) => sortChats(applyIncomingMessage(current, message)));
    }, []);

    /** Открытый чат прочитан — счётчик непрочитанных в списке сбрасывается */
    const markRead = useCallback((chatId: number) => {
        setChats((current) => current.map((chat) => (chat.id === chatId && chat.countUnreadMessages ? { ...chat, countUnreadMessages: 0 } : chat)));
    }, []);

    return { chats, loaded, search, setSearch, status, setStatus, reload, applyMessage, markRead };
}

const PAGE_SIZE = 50;

/** Сообщения открытого чата: страницы по 50, свежие сверху; новые приходят через addMessage */
export function useChatMessages(token: string | undefined, chatId: string | undefined) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (nextPage: number) => {
        if (!chatId) return;
        setLoading(true);
        const result = await browserApi(token)
            .GET("/api/v1/chats/{chatId}/messages", { params: { path: { chatId }, query: { page: nextPage, itemsPerPage: PAGE_SIZE } as never } })
            .catch(() => null);
        setLoading(false);
        const list = Array.isArray(result?.data) ? (result.data as ChatMessage[]) : [];
        setMessages((current) => mergeMessages(nextPage === 1 ? [] : current, list));
        setHasMore(list.length === PAGE_SIZE);
        setPage(nextPage);
    }, [chatId, token]);

    useEffect(() => {
        // Другой чат: прежние сообщения убираем сразу, не дожидаясь первой страницы нового
        /* eslint-disable react-hooks/set-state-in-effect */
        setMessages([]);
        setHasMore(false);
        void load(1);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [load]);

    const loadMore = useCallback(() => {
        if (hasMore && !loading) void load(page + 1);
    }, [hasMore, load, loading, page]);

    const addMessage = useCallback((message: ChatMessage) => {
        if (!chatId || idFromIri(message.chat) !== chatId) return;
        setMessages((current) => mergeMessages(current, [message]));
    }, [chatId]);

    /** Опрос без Mercure: свежая первая страница поверх загруженных */
    const refresh = useCallback(async () => {
        if (!chatId) return;
        const result = await browserApi(token)
            .GET("/api/v1/chats/{chatId}/messages", { params: { path: { chatId }, query: { page: 1, itemsPerPage: PAGE_SIZE } as never } })
            .catch(() => null);
        if (Array.isArray(result?.data)) setMessages((current) => mergeMessages(current, result.data as ChatMessage[]));
    }, [chatId, token]);

    return { messages, hasMore, loading, loadMore, addMessage, refresh };
}

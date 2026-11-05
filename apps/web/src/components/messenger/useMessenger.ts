"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URL, browserApi } from "@/lib/browserApi";
import { type ApplicationStatus, applyIncomingMessage, type Chat, type ChatMessage, idFromIri, mergeMessages, sortChats } from "@/lib/messenger";

/** Токен Mercure старого SPA (localStorage, JSON-строкой); без него — опрос сервера */
const mercureToken = (): string | null => {
    try {
        const value: unknown = JSON.parse(window.localStorage.getItem("mercureToken") ?? "null");
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

const LIST_PAGE = 100;
/** Предохранитель: больше 2000 переписок у одного человека не бывает */
const LIST_MAX_PAGES = 20;

/**
 * Список чатов вошедшего с поиском. API отдаёт по страницам — грузим все
 * (раньше бралась только первая страница из 30, и у организаторов старые
 * переписки пропадали). Вкладки «Непрочитанные», «Ждут ответа» и т. п.
 * фильтруются в браузере по загруженному списку.
 */
export function useChatList(token: string | undefined, enabled: boolean) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [search, setSearch] = useState("");
    // Поиск — на сервере, после паузы в наборе: не перезапрашивать все страницы на каждую букву
    const [query, setQuery] = useState("");
    useEffect(() => {
        const timer = window.setTimeout(() => setQuery(search.trim()), 300);
        return () => window.clearTimeout(timer);
    }, [search]);

    const reload = useCallback(async () => {
        if (!enabled) return;
        const all: Chat[] = [];
        let ok = true;
        for (let page = 1; page <= LIST_MAX_PAGES; page += 1) {
            const params: Record<string, string | number> = { page, itemsPerPage: LIST_PAGE };
            if (query) params.search = query;
            const result = await browserApi(token)
                .GET("/api/v1/personal/chats", { params: { query: params as never } })
                .catch(() => null);
            if (!Array.isArray(result?.data)) {
                ok = page > 1;
                break;
            }
            all.push(...result.data);
            if (result.data.length < LIST_PAGE) break;
        }
        if (ok) setChats(sortChats(all));
        setFailed(!ok);
        setLoaded(true);
    }, [enabled, query, token]);

    useEffect(() => {
        // Загрузка данных при смене поиска
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

    /** Организатор принял или отклонил заявку — плашка в списке меняется сразу */
    const setApplicationStatus = useCallback((chatId: number, status: ApplicationStatus) => {
        setChats((current) => current.map((chat) => (chat.id === chatId && chat.application ? { ...chat, applicationStatus: status, application: { ...chat.application, status } } : chat)));
    }, []);

    return { chats, loaded, failed, search, setSearch, reload, applyMessage, markRead, setApplicationStatus };
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

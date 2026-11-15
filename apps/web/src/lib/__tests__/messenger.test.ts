import { describe, expect, it, vi } from "vitest";

import {
    applyIncomingMessage, type Chat, companionTarget, fetchAllChats, formatMessageDate, idFromIri, isImageAttachment, linkify, mergeMessages, setArrival, setDeparture, sortChats,
} from "../messenger";

const chat = (id: number, createdAt?: string, unread = 0): Chat => ({
    id,
    countUnreadMessages: unread,
    lastMessage: createdAt ? { id: id * 10, text: "x", createdAt, author: { id: "a" } } as Chat["lastMessage"] : null,
    otherParticipants: [],
});

describe("список чатов", () => {
    it("сортирует по последнему сообщению, без сообщений — по номеру", () => {
        const sorted = sortChats([chat(1, "2026-10-01T10:00:00Z"), chat(2, "2026-11-01T10:00:00Z"), chat(3)]);
        expect(sorted.map((item) => item.id)).toEqual([2, 1, 3]);
    });

    it("новое сообщение меняет только свой чат и добавляет непрочитанное", () => {
        const before = [chat(1, "2026-10-01T10:00:00Z", 2), chat(2, "2026-10-02T10:00:00Z")];
        const after = applyIncomingMessage(before, { id: 99, text: "привет", chat: "/api/v1/chats/1", createdAt: "2026-11-01T10:00:00Z" });
        expect(after[0]?.countUnreadMessages).toBe(3);
        expect(after[0]?.lastMessage?.text).toBe("привет");
        expect(after[0]?.lastMessage?.author).toEqual({ id: "a" });
        expect(after[1]).toBe(before[1]);
        expect(applyIncomingMessage(before, { id: 1, chat: "/api/v1/chats/77" })).toEqual(before);
    });

    it("idFromIri берёт последнюю часть адреса", () => {
        expect(idFromIri("/api/v1/chats/12")).toBe("12");
        expect(idFromIri("https://api.goodsurfing.org/api/v1/media_objects/abc/")).toBe("abc");
        expect(idFromIri(undefined)).toBeUndefined();
    });
});

describe("сообщения", () => {
    it("объединяет страницы без повторов, свежие сверху", () => {
        const merged = mergeMessages(
            [{ id: 2, createdAt: "2026-11-01T10:00:00Z" }, { id: 1, createdAt: "2026-10-01T10:00:00Z" }],
            [{ id: 3, createdAt: "2026-11-02T10:00:00Z" }, { id: 2, createdAt: "2026-11-01T10:00:00Z", text: "правка" }],
        );
        expect(merged.map((message) => message.id)).toEqual([3, 2, 1]);
        expect(merged[1]?.text).toBe("правка");
    });

    it("ссылки — в <a>, остальное экранируется", () => {
        expect(linkify("см. https://goodsurfing.org/x?a=1 <b>")).toBe(
            'см. <a href="https://goodsurfing.org/x?a=1" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;word-break:break-all;">https://goodsurfing.org/x?a=1</a> &lt;b&gt;',
        );
        expect(linkify("href='https://a.b' дальше")).toContain("&#39; дальше");
    });

    it("картинка или файл — по расширению", () => {
        expect(isImageAttachment("/media/photo.JPG")).toBe(true);
        expect(isImageAttachment("/media/doc.pdf")).toBe(false);
    });

    it("дата: сегодня — время, иначе день", () => {
        const now = new Date("2026-11-02T15:00:00");
        expect(formatMessageDate("ru", "2026-11-02T09:05:00", "Без даты", now)).toBe("09:05");
        expect(formatMessageDate("ru", "2026-10-30T09:05:00", "Без даты", now)).toBe("30.10.2026");
        expect(formatMessageDate("ru", undefined, "Без даты", now)).toBe("Без даты");
    });
});

describe("собеседник", () => {
    it("организатор без профиля волонтёра — организация; волонтёру — организация; организатору — волонтёр", () => {
        expect(companionTarget({ id: "u", hostId: "o" }, true)).toEqual({ kind: "organization", id: "o" });
        expect(companionTarget({ id: "u", hostId: "o", volunteer: {} }, false)).toEqual({ kind: "organization", id: "o" });
        expect(companionTarget({ id: "u", hostId: "o", volunteer: {} }, true)).toEqual({ kind: "volunteer", id: "u" });
        expect(companionTarget({ id: "u" }, true)).toEqual({ kind: "volunteer", id: "u" });
        expect(companionTarget(undefined, true)).toBeNull();
    });
});

describe("даты заявки", () => {
    it("прибытие позже отъезда сдвигает отъезд; отъезд раньше прибытия не принимается", () => {
        expect(setArrival({ start: null, end: null }, "2026-12-01")).toEqual({ start: "2026-12-01", end: "2026-12-01" });
        expect(setArrival({ start: "2026-12-01", end: "2026-12-10" }, "2026-12-05")).toEqual({ start: "2026-12-05", end: "2026-12-10" });
        expect(setArrival({ start: "2026-12-01", end: "2026-12-10" }, "2026-12-20")).toEqual({ start: "2026-12-20", end: "2026-12-20" });
        expect(setDeparture({ start: "2026-12-05", end: "2026-12-10" }, "2026-12-01", "2026-11-02")).toEqual({ start: "2026-12-05", end: "2026-12-10" });
        expect(setDeparture({ start: null, end: null }, "2026-12-01", "2026-11-02")).toEqual({ start: "2026-11-02", end: "2026-12-01" });
    });
});

describe("fetchAllChats — все страницы списка чатов", () => {
    const chats = (from: number, count: number) => Array.from({ length: count }, (_, i) => ({ id: from + i }) as Chat);

    it("догружает страницы, пока не придёт неполная", async () => {
        const pages: Record<number, Chat[]> = { 1: chats(1, 100), 2: chats(101, 100), 3: chats(201, 64) };
        const requested: number[] = [];
        const all = await fetchAllChats(async (page) => {
            requested.push(page);
            return pages[page] ?? [];
        });
        expect(requested).toEqual([1, 2, 3]);
        expect(all?.length).toBe(264);
    });

    it("одна неполная страница — один запрос", async () => {
        const fetchPage = vi.fn(async () => chats(1, 35));
        expect((await fetchAllChats(fetchPage))?.length).toBe(35);
        expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it("ошибка на первой странице — null, на следующих — что успели", async () => {
        expect(await fetchAllChats(async () => null)).toBeNull();
        const partial = await fetchAllChats(async (page) => (page === 1 ? chats(1, 100) : null));
        expect(partial?.length).toBe(100);
    });

    it("чат, переехавший между страницами, не дублируется", async () => {
        const all = await fetchAllChats(async (page) => (page === 1 ? chats(1, 100) : [...chats(100, 1), ...chats(101, 5)]));
        expect(all?.map((chat) => chat.id).filter((id) => id === 100)).toHaveLength(1);
        expect(all?.length).toBe(105);
    });
});

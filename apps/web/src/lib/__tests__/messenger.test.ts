import { describe, expect, it } from "vitest";

import {
    applyIncomingMessage, type Chat, chatInTab, companionTarget, formatDateRange, formatDayLabel, formatListTime, formatMessageDate, idFromIri, isImageAttachment, linkify,
    mergeMessages, readByOthers, sameGroup, setArrival, setDeparture, sortChats, statusChip,
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

describe("мессенджер как в Worldpackers", () => {
    const now = new Date(2026, 10, 5, 15, 0);
    const at = (days: number, hours = 10) => new Date(2026, 10, 5 - days, hours, 5).toISOString();

    it("время в списке: сегодня — часы, вчера — «Вчера», на неделе — день, в этом году — число и месяц", () => {
        expect(formatListTime("ru", at(0), now)).toBe("10:05");
        expect(formatListTime("ru", at(1), now)).toBe("Вчера");
        expect(formatListTime("ru", at(2), now)).toBe("Вт");
        expect(formatListTime("ru", new Date(2026, 9, 3).toISOString(), now)).toBe("3 окт.");
        expect(formatListTime("ru", new Date(2025, 9, 3).toISOString(), now)).toBe("03.10.2025");
        expect(formatListTime("ru", null, now)).toBe("");
    });

    it("разделитель дней: «Сегодня», «Вчера», дата словами", () => {
        expect(formatDayLabel("ru", at(0), now)).toBe("Сегодня");
        expect(formatDayLabel("ru", at(1), now)).toBe("Вчера");
        expect(formatDayLabel("en", at(1), now)).toBe("Yesterday");
        expect(formatDayLabel("ru", new Date(2026, 9, 3).toISOString(), now)).toBe("3 октября");
        expect(formatDayLabel("ru", new Date(2025, 9, 3).toISOString(), now)).toBe("3 октября 2025 г.");
    });

    it("даты заявки коротким диапазоном, без сдвига часового пояса", () => {
        expect(formatDateRange("ru", "2026-12-01", "2026-12-20")).toBe("1–20 дек. 2026 г.");
        expect(formatDateRange("ru", "2026-12-28", "2027-01-05")).toBe("28 дек. 2026 г. – 5 янв. 2027 г.");
        expect(formatDateRange("ru", "2026-12-01", "2026-12-01")).toBe("1 дек. 2026 г.");
        expect(formatDateRange("ru", null, "2026-12-01")).toBe("");
    });

    const withApp = (status: string | null, lastAuthor: string | null, unread = 0): Chat => ({
        id: 1,
        countUnreadMessages: unread,
        lastMessage: lastAuthor ? { id: 1, text: "x", createdAt: at(0), author: { id: lastAuthor } } as Chat["lastMessage"] : null,
        otherParticipants: [],
        application: status ? { id: 5, status } : null,
    });

    it("вкладки: непрочитанные, ждут ответа (последнее — от собеседника), принятые", () => {
        expect(chatInTab(withApp(null, "me"), "all", "me")).toBe(true);
        expect(chatInTab(withApp(null, "me", 2), "unread", "me")).toBe(true);
        expect(chatInTab(withApp(null, "me"), "unread", "me")).toBe(false);
        expect(chatInTab(withApp("new", "other"), "awaiting", "me")).toBe(true);
        expect(chatInTab(withApp("new", "me"), "awaiting", "me")).toBe(false);
        expect(chatInTab(withApp("new", null), "awaiting", "me")).toBe(false);
        expect(chatInTab(withApp("accepted", "me"), "accepted", "me")).toBe(true);
        expect(chatInTab(withApp("new", "me"), "accepted", "me")).toBe(false);
    });

    it("плашка статуса: новая заявка у организатора и отправленная у волонтёра", () => {
        expect(statusChip("new", false)).toBe("incoming");
        expect(statusChip("new", true)).toBe("sent");
        expect(statusChip("accepted", true)).toBe("accepted");
        expect(statusChip("canceled", false)).toBe("canceled");
        expect(statusChip(null, true)).toBeNull();
    });

    it("две галочки — когда прочитал кто-то кроме автора", () => {
        expect(readByOthers({ readByUserIds: ["me"] }, "me")).toBe(false);
        expect(readByOthers({ readByUserIds: ["me", "other"] }, "me")).toBe(true);
        expect(readByOthers({}, "me")).toBe(false);
    });

    it("группа сообщений — один автор в пределах 5 минут", () => {
        const a = { author: "/api/v1/users/a", createdAt: "2026-11-05T10:00:00Z" };
        expect(sameGroup(a, { author: a.author, createdAt: "2026-11-05T10:04:00Z" })).toBe(true);
        expect(sameGroup(a, { author: a.author, createdAt: "2026-11-05T10:06:00Z" })).toBe(false);
        expect(sameGroup(a, { author: "/api/v1/users/b", createdAt: a.createdAt })).toBe(false);
        expect(sameGroup(a, undefined)).toBe(false);
    });

    it("событие Mercure меняет автора последнего сообщения", () => {
        const before = [withApp(null, "me")];
        const after = applyIncomingMessage(before, { id: 2, text: "ответ", chat: "/api/v1/chats/1", author: "/api/v1/users/other" });
        expect(after[0]?.lastMessage?.author?.id).toBe("other");
    });
});

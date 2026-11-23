import { describe, expect, it } from "vitest";

import { eventAction, type EventFeedLabels, holdersText, relativeTime } from "../eventFeed";

const labels: EventFeedLabels = {
    badge: "Получен значок", trip: "Едет в проект", member: "Теперь в сообществе", memberInternational: "Теперь в международном клубе",
    vacancy: "Новая вакансия", review: "Новый отзыв", article: "Новая статья", holders: "Получили: {count}"
};
const event = (type: string, extra = {}) => ({ type, at: "2026-11-05T10:00:00+03:00", title: "x", targetKind: "offer", targetId: "1", ...extra });

describe("лента событий", () => {
    it("подпись по виду события, международный клуб отдельно", () => {
        expect(eventAction(event("badge"), labels)).toBe("Получен значок");
        expect(eventAction(event("member", { membership: "regular" }), labels)).toBe("Теперь в сообществе");
        expect(eventAction(event("member", { membership: "international" }), labels)).toBe("Теперь в международном клубе");
        expect(eventAction(event("article"), labels)).toBe("Новая статья");
    });

    it("время: сегодня, вчера, дни, недели", () => {
        const now = new Date(2026, 10, 20, 15);
        expect(relativeTime("ru", new Date(2026, 10, 20, 9).toISOString(), now)).toBe("сегодня");
        expect(relativeTime("ru", new Date(2026, 10, 19, 9).toISOString(), now)).toBe("вчера");
        expect(relativeTime("ru", new Date(2026, 10, 17, 9).toISOString(), now)).toBe("3 дня назад");
        expect(relativeTime("ru", new Date(2026, 10, 6, 9).toISOString(), now)).toBe("2 недели назад");
        expect(relativeTime("en", new Date(2026, 10, 19, 9).toISOString(), now)).toBe("yesterday");
    });

    it("число владельцев значка", () => {
        expect(holdersText("Получили: {count}", 1234).replace(/\s/g, " ")).toBe("Получили: 1 234");
    });
});

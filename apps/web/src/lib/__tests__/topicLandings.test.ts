import { describe, expect, it } from "vitest";

import { TOPIC_LANDINGS, topicBySlug } from "../topicLandings";
import { VOLUNTEERING_LANDINGS } from "../volunteeringLandings";

describe("посадочные страницы тем и регионов", () => {
    it("адреса уникальны и не пересекаются с направлениями", () => {
        const slugs = [...TOPIC_LANDINGS, ...VOLUNTEERING_LANDINGS].map((item) => item.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
        for (const slug of slugs) expect(slug).toMatch(/^[a-z-]+$/);
    });

    it("у каждой страницы есть выборка, тексты и вопросы", () => {
        for (const item of TOPIC_LANDINGS) {
            expect(item.query.categoryIds?.length || item.query.search).toBeTruthy();
            expect(item.h1.length).toBeGreaterThan(5);
            expect(item.description.length).toBeLessThanOrEqual(200);
            expect(item.intro.length).toBeGreaterThan(0);
            expect(item.faq.length).toBeGreaterThan(0);
        }
    });

    it("без цен в текстах (Гудсёрфинг — НКО)", () => {
        for (const item of TOPIC_LANDINGS) {
            expect(JSON.stringify(item)).not.toMatch(/₽|руб/);
        }
    });

    it("поиск по адресу", () => {
        expect(topicBySlug("baikal")?.query.search).toBe("Байкал");
        expect(topicBySlug("expeditions")?.query.categoryIds).toEqual([2, 10]);
        expect(topicBySlug("farm")).toBeUndefined();
    });
});

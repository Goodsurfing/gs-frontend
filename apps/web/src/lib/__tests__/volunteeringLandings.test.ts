import { describe, expect, it } from "vitest";

import { genericLanding, landingByCategory, landingBySlug, VOLUNTEERING_LANDINGS } from "../volunteeringLandings";

describe("посадочные страницы направлений", () => {
    it("адреса и категории не повторяются, тексты влезают в выдачу", () => {
        const slugs = VOLUNTEERING_LANDINGS.map((item) => item.slug);
        expect(new Set(slugs).size).toBe(slugs.length);
        expect(new Set(VOLUNTEERING_LANDINGS.map((item) => item.categoryId)).size).toBe(slugs.length);
        for (const item of VOLUNTEERING_LANDINGS) {
            expect(item.slug).toMatch(/^[a-z-]+$/);
            expect(item.ru.title.length, item.slug).toBeLessThanOrEqual(70);
            expect(item.ru.description.length, item.slug).toBeLessThanOrEqual(200);
            expect(item.ru.faq.length, item.slug).toBeGreaterThan(0);
        }
        expect(landingBySlug("farm")?.categoryId).toBe(3);
        expect(landingByCategory(1)?.slug).toBe("hostel");
        expect(landingBySlug("nope")).toBeUndefined();
    });

    it("en/es — шаблон с названием направления", () => {
        const copy = genericLanding("Farm work", (key) => ({ "landing.title": "Volunteering: {name}", "landing.h1": "{name}" } as Record<string, string>)[key] ?? key);
        expect(copy.title).toBe("Volunteering: Farm work");
        expect(copy.h1).toBe("Farm work");
    });
});

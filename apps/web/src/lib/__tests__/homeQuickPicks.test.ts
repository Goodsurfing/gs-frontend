import { describe, expect, it } from "vitest";

import { homeQuickPicks } from "../landingMenu";
import { TOPIC_LANDINGS } from "../topicLandings";

describe("подборки под поиском на главной (GS-292)", () => {
    it("по-русски: сначала зима, потом темы и регионы, в конце все направления", () => {
        const picks = homeQuickPicks("ru");
        expect(picks[0]).toEqual({ label: "Зимой", href: "/winter-volunteering" });
        expect(picks[1]).toEqual({ label: "Экспедиции", href: "/volunteering/expeditions" });
        expect(picks.at(-1)).toEqual({ label: "Все направления", href: "/volunteering" });
        expect(picks).toHaveLength(7);
    });

    it("ведут только на существующие посадочные страницы", () => {
        const slugs = new Set(TOPIC_LANDINGS.map((item) => item.slug));
        for (const { href } of homeQuickPicks("ru")) {
            const slug = href.match(/^\/volunteering\/(.+)$/)?.[1];
            if (slug) expect(slugs.has(slug)).toBe(true);
        }
        expect(new Set(homeQuickPicks("ru").map((pick) => pick.href)).size).toBe(homeQuickPicks("ru").length);
    });

    it("en/es: направления из плиток главной, без русских страниц", () => {
        const categories = [{ id: 3, name: "Farm work" }, { id: 1, name: "Hostel" }];
        expect(homeQuickPicks("en", categories)).toEqual([
            { label: "Volunteer in Russia", href: "/en/volunteer-in-russia" },
            { label: "Farm work", href: "/en/offers-map?category=3" },
            { label: "Hostel", href: "/en/offers-map?category=1" },
            { label: "All categories", href: "/en/volunteering" },
        ]);
        expect(homeQuickPicks("es", categories).map((pick) => pick.href)).toEqual(["/es/offers-map?category=3", "/es/offers-map?category=1", "/es/volunteering"]);
    });
});

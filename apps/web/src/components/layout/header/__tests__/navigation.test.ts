import { describe, expect, it } from "vitest";

import { buildNavigation } from "../navigation";

const t = (key: string) => key;

describe("buildNavigation", () => {
    it("адреса — как в старом фронте, с языком", () => {
        const { offers, entries } = buildNavigation("en", t);
        expect(offers.href).toBe("/en/offers-map");
        const hrefs = entries.flatMap((e) => (e.kind === "link" ? [e.href] : e.items.map((i) => i.href)));
        expect(hrefs).toContain("/en/journals");
        expect(hrefs).toContain("/en/donation-rating");
        expect(hrefs).toContain("https://international.goodsurfing.org/");
        for (const href of hrefs) expect(href).toMatch(/^(\/en(\/|$)|https:\/\/)/);
    });

    it("порядок разделов: «Куда поехать» первым (с «Международным» внутри), дальше — как в старом фронте", () => {
        const labels = buildNavigation("ru", t).entries.map((e) => e.label);
        expect(labels).toEqual([
            "main.welcome.header.where-to-go",
            "main.welcome.header.community.title",
            "main.welcome.header.donation.title",
            "main.welcome.header.about-project.title",
            "main.welcome.header.for-organizers.become-a-host",
        ]);
    });

    it("GS-243: «Экспедиции» — последний пункт «Сообщества»", () => {
        const community = buildNavigation("ru", t).entries[1];
        expect(community?.kind).toBe("group");
        const items = community?.kind === "group" ? community.items : [];
        expect(items.at(-1)).toEqual({ label: "main.welcome.header.expeditions", href: "https://expedition.goodsurfing.org/" });
    });

    it("«Достижения» — в «Сообществе», сразу после «Амбассадоров», как в подвале", () => {
        const community = buildNavigation("ru", t).entries[1];
        const items = community?.kind === "group" ? community.items : [];
        const index = items.findIndex((item) => item.href === "/achievements");
        expect(items[index]?.label).toBe("main.welcome.header.community.achievements");
        expect(items[index - 1]?.label).toBe("main.welcome.header.community.ambassadors");
    });

    it("«Куда поехать» — хаб и посадочные страницы", () => {
        const group = buildNavigation("ru", t).entries[0];
        const hrefs = group?.kind === "group" ? group.items.map((item) => item.href) : [];
        expect(hrefs[0]).toBe("/volunteering");
        expect(hrefs).toEqual(expect.arrayContaining(["/winter-volunteering", "/volunteering/expeditions", "/volunteering/baikal", "/volunteering/horses"]));
        const en = buildNavigation("en", t).entries[0];
        expect(en?.kind === "group" ? en.items.map((item) => item.href) : []).toEqual(["/en/volunteering", "/en/volunteer-in-russia", "https://international.goodsurfing.org/"]);
    });
});

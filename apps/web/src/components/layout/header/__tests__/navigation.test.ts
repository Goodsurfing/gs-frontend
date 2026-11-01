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

    it("порядок разделов как в шапке старого фронта", () => {
        const labels = buildNavigation("ru", t).entries.map((e) => e.label);
        expect(labels).toEqual([
            "main.welcome.header.community.title",
            "main.welcome.header.donation.title",
            "main.welcome.header.about-project.title",
            "main.welcome.header.for-organizers.become-a-host",
            "main.welcome.header.expeditions",
            "main.welcome.header.international-volunteering",
        ]);
    });
});

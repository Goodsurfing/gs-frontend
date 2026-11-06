import { describe, expect, it } from "vitest";

import { legacyOffersListTarget } from "../legacyOffersLink";

describe("legacyOffersListTarget", () => {
    it("переводит рекламную ссылку старого каталога на карту с категорией и метками", () => {
        const target = legacyOffersListTarget(
            { order_by: "", place: "", host_categories: "[3]", min_participant_days: "1", utm_source: "yandex", utm_content: "farm", yclid: "436" },
            "/offers-map",
        );
        expect(target).toBe("/offers-map?category=3&utm_source=yandex&utm_content=farm&yclid=436");
    });

    it("несколько категорий — через запятую, как в каталоге", () => {
        expect(legacyOffersListTarget({ host_categories: "[3,4]" }, "/offers-map")).toBe("/offers-map?category=3%2C4");
    });

    it("без категории ведёт просто на карту", () => {
        expect(legacyOffersListTarget({ order_by: "", host_categories: "[]" }, "/en/offers-map")).toBe("/en/offers-map");
    });

    it("обычную ссылку на вакансию не трогает", () => {
        expect(legacyOffersListTarget({}, "/offers-map")).toBeNull();
        expect(legacyOffersListTarget({ utm_source: "vk" }, "/offers-map")).toBeNull();
    });
});

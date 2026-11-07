import { describe, expect, it } from "vitest";

import { badgeHtml, offerShareCopy, offerShareText, shareLinks, withShareMark } from "../share";

describe("ссылки «поделиться»", () => {
    it("метка Метрики: кто поделился и что", () => {
        const url = new URL(withShareMark("https://goodsurfing.org/offers/5516", "host"));
        expect(url.searchParams.get("utm_source")).toBe("share");
        expect(url.searchParams.get("utm_medium")).toBe("host");
        expect(url.searchParams.get("utm_campaign")).toBe("offer");
    });

    it("сохраняет уже имеющиеся параметры (код «Пригласи друга»)", () => {
        const url = new URL(withShareMark("https://goodsurfing.org/offers/1?ref=abc", "volunteer"));
        expect(url.searchParams.get("ref")).toBe("abc");
        expect(url.searchParams.get("utm_medium")).toBe("volunteer");
    });

    it("VK, Telegram, WhatsApp — с адресом и текстом", () => {
        const links = shareLinks("https://goodsurfing.org/offers/1", "Ищем волонтёров");
        expect(links.vk).toContain("vk.com/share.php?url=https%3A%2F%2Fgoodsurfing.org%2Foffers%2F1");
        expect(links.telegram).toContain("t.me/share/url?url=");
        expect(decodeURIComponent(links.whatsapp)).toContain("Ищем волонтёров\nhttps://goodsurfing.org/offers/1");
    });
});

describe("текст поста", () => {
    const facts = { title: "Волонтёрство с видом на Байкал", place: "Иркутская область", highlights: ["Койко-место", "Полный пансион"] };

    it("организатор — «Ищем волонтёров», волонтёр — «Еду волонтёром»", () => {
        expect(offerShareText(facts, "host", "ru")).toBe("🌿 Ищем волонтёров: Волонтёрство с видом на Байкал\n📍 Иркутская область\n✅ Койко-место · Полный пансион");
        expect(offerShareText(facts, "volunteer", "ru").startsWith("🎒 Еду волонтёром:")).toBe(true);
        expect(offerShareText(facts, "host", "en").startsWith("🌿 We are looking for volunteers:")).toBe(true);
    });

    it("без места и условий — только первая строка", () => {
        expect(offerShareText({ title: "Ферма", place: null, highlights: [] }, "host", "ru")).toBe("🌿 Ищем волонтёров: Ферма");
    });

    it("для копирования — с адресом", () => {
        expect(offerShareCopy("Текст", "https://x", "ru")).toBe("Текст\nПодробности и отклик: https://x");
    });
});

describe("код значка", () => {
    it("ссылка на страницу организатора и картинка; кавычки в названии экранированы", () => {
        const html = badgeHtml({ pageUrl: "https://goodsurfing.org/organizations/1", imageUrl: "https://goodsurfing.org/organizations/1/badge", name: "Хутор \"Ромашка\"" });
        expect(html).toContain('href="https://goodsurfing.org/organizations/1"');
        expect(html).toContain('src="https://goodsurfing.org/organizations/1/badge"');
        expect(html).toContain("Хутор &quot;Ромашка&quot; на Гудсёрфинге");
    });
});

import { describe, expect, it } from "vitest";

import { reportLink, reportStartParam } from "../testBanner";

const decode = (param: string) => {
    const b64 = param.slice(4).replace(/-/g, "+").replace(/_/g, "/");
    return new TextDecoder().decode(Uint8Array.from(atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4)), (c) => c.charCodeAt(0)));
};

describe("ссылка «Сообщить о проблеме»", () => {
    it("кладёт путь страницы в параметр /start, который принимает Telegram", () => {
        const param = reportStartParam("/offers/7242");
        expect(param).toMatch(/^bug_[A-Za-z0-9_-]+$/);
        expect(decode(param)).toBe("/offers/7242");
        expect(reportLink("goodsurfing_testing_bot", "/offers/7242")).toBe(`https://t.me/goodsurfing_testing_bot?start=${param}`);
    });

    it("кириллица в пути не ломает параметр", () => {
        const param = reportStartParam("/blog/привет");
        expect(param).toMatch(/^bug_[A-Za-z0-9_-]+$/);
        expect(decode(param)).toBe("/blog/привет");
    });

    it("слишком длинный путь — просто bug (лимит Telegram 64 знака)", () => {
        expect(reportStartParam("/admin/users/" + "x".repeat(80))).toBe("bug");
    });
});

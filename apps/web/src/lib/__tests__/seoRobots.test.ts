import { describe, expect, it } from "vitest";

import { pageMetadata } from "../seo";

const base = { locale: "ru" as const, path: "/offers/1", title: "t", description: "d" };

describe("pageMetadata: robots", () => {
    it("обычная страница — без robots", () => {
        expect(pageMetadata(base).robots).toBeUndefined();
    });

    it("noindex — свой тег noindex, follow", () => {
        expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: true });
    });

    // Ответу 404 Next сам ставит <meta name="robots" content="noindex"> — второй тег не нужен
    it("404 — свой тег не ставится", () => {
        expect(pageMetadata({ ...base, noindex: true, notFound: true }).robots).toBeUndefined();
    });
});

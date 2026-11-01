import type { ErrorEvent } from "@sentry/react";
import { describe, expect, it } from "vitest";

import { IGNORED_ERRORS, isForeignTranslatorError } from "./initErrorTracking";

const withFrames = (...filenames: string[]) => {
    const frames = filenames.map((filename) => ({ filename }));
    return { exception: { values: [{ stacktrace: { frames } }] } } as ErrorEvent;
};

describe("isForeignTranslatorError", () => {
    it("отбрасывает ошибку переводчика: страница переведена, наших файлов в стеке нет", () => {
        const event = withFrames("https://goodsurfing.org/en/categories");
        expect(isForeignTranslatorError(event, true)).toBe(true);
    });

    it("оставляет ошибку, если в стеке есть наш код", () => {
        const event = withFrames(
            "https://goodsurfing.org/en/",
            "https://goodsurfing.org/assets/index-abc.js",
        );
        expect(isForeignTranslatorError(event, true)).toBe(false);
    });

    it("оставляет ошибку на непереведённой странице", () => {
        expect(isForeignTranslatorError(withFrames("https://goodsurfing.org/en/"), false)).toBe(false);
    });

    it("оставляет ошибку без стека", () => {
        expect(isForeignTranslatorError({} as ErrorEvent, true)).toBe(false);
    });
});

describe("IGNORED_ERRORS", () => {
    const ignored = (message: string) => IGNORED_ERRORS.some((rule) => (
        typeof rule === "string" ? message.includes(rule) : rule.test(message)
    ));

    it("отсеивает недогрузившиеся файлы сайта и чужие скрипты", () => {
        expect(ignored("Unable to preload CSS for /assets/OffersSlider-DnNMkooZ.css")).toBe(true);
        expect(ignored("Importing a module script failed.")).toBe(true);
        expect(ignored("undefined is not an object (evaluating 'r[\"@context\"].toLowerCase')")).toBe(true);
    });

    it("не прячет настоящие ошибки", () => {
        expect(ignored("Cannot read properties of null (reading 'getItem')")).toBe(false);
        expect(ignored("TypeError: Failed to fetch")).toBe(false);
    });
});

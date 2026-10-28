import type { ErrorEvent } from "@sentry/react";
import { describe, expect, it } from "vitest";

import { isForeignTranslatorError } from "./initErrorTracking";

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

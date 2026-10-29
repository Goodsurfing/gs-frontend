import { describe, expect, it } from "vitest";

import { pageItems } from "../pagination";

describe("pageItems — как MUI Pagination", () => {
    it("мало страниц — все подряд", () => {
        expect(pageItems(1, 3)).toEqual([1, 2, 3]);
        expect(pageItems(2, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
        expect(pageItems(2, 10)).toEqual([1, 2, 3, 4, 5, "end-ellipsis", 10]);
    });

    it("середина — многоточия с обеих сторон", () => {
        expect(pageItems(10, 20)).toEqual([1, "start-ellipsis", 9, 10, 11, "end-ellipsis", 20]);
    });

    it("конец — многоточие слева", () => {
        expect(pageItems(20, 20)).toEqual([1, "start-ellipsis", 16, 17, 18, 19, 20]);
    });

    it("одна страница", () => {
        expect(pageItems(1, 1)).toEqual([1]);
    });
});

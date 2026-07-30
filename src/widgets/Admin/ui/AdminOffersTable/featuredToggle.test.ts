import { describe, it, expect } from "vitest";
import { isFeaturedCapReached, MAX_FEATURED_OFFERS } from "./featuredToggle";

describe("isFeaturedCapReached", () => {
    it("не блокирует включение, пока лимит не достигнут", () => {
        expect(isFeaturedCapReached(9, true)).toBe(false);
    });

    it("блокирует включение, когда лимит уже достигнут", () => {
        expect(isFeaturedCapReached(MAX_FEATURED_OFFERS, true)).toBe(true);
    });

    it("блокирует включение и при превышении лимита", () => {
        expect(isFeaturedCapReached(MAX_FEATURED_OFFERS + 3, true)).toBe(true);
    });

    it("никогда не блокирует выключение, даже при переполненном лимите", () => {
        expect(isFeaturedCapReached(MAX_FEATURED_OFFERS, false)).toBe(false);
    });
});

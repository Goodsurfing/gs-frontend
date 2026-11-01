import { describe, it, expect } from "vitest";
import { hasHostMembership } from "./profileApi";

describe("hasHostMembership", () => {
    it("берёт isHostMembership, когда бэкенд его отдаёт", () => {
        expect(hasHostMembership({ isMembership: true, isHostMembership: false })).toBe(false);
        expect(hasHostMembership({ isMembership: true, isHostMembership: true })).toBe(true);
    });

    it("на старом бэкенде без поля — как раньше, по isMembership", () => {
        expect(hasHostMembership({ isMembership: true })).toBe(true);
        expect(hasHostMembership({ isMembership: false })).toBe(false);
        expect(hasHostMembership(undefined)).toBe(false);
    });
});

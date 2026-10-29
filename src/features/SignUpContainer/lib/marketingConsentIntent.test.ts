import {
    beforeEach, describe, expect, it,
} from "vitest";

import {
    hasMarketingConsentIntent,
    saveMarketingConsentIntent,
    takeMarketingConsentIntent,
} from "./marketingConsentIntent";

describe("отметка согласия на рассылку при входе через VK", () => {
    beforeEach(() => sessionStorage.clear());

    it("переживает уход на VK и забывается после использования", () => {
        saveMarketingConsentIntent(true);
        expect(hasMarketingConsentIntent()).toBe(true);
        expect(takeMarketingConsentIntent()).toBe(true);
        expect(takeMarketingConsentIntent()).toBe(false);
    });

    it("снятая отметка не сохраняется", () => {
        saveMarketingConsentIntent(true);
        saveMarketingConsentIntent(false);
        expect(takeMarketingConsentIntent()).toBe(false);
    });
});

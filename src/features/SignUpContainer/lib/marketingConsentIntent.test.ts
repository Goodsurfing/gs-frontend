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
    });

    it("по умолчанию отмечено", () => {
        expect(hasMarketingConsentIntent()).toBe(true);
        expect(takeMarketingConsentIntent()).toBe(true);
    });

    it("снятая отметка переживает уход на VK", () => {
        saveMarketingConsentIntent(false);
        expect(hasMarketingConsentIntent()).toBe(false);
        expect(takeMarketingConsentIntent()).toBe(false);
        // после использования — снова значение по умолчанию
        expect(hasMarketingConsentIntent()).toBe(true);
    });
});

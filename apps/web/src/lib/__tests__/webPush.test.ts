import { describe, expect, it } from "vitest";

import { keyBytes, OFFER_PAUSE_MS, pushSupport, shouldOffer } from "../webPush";

const env = { userAgent: "Mozilla/5.0 (Windows NT 10.0) Chrome/130", standalone: false, hasServiceWorker: true, hasPushManager: true, hasNotification: true };
const iphone = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1";

describe("веб-пуши", () => {
    it("поддержка: браузер с пушами; iPhone без установки — подсказка про экран «Домой»", () => {
        expect(pushSupport(env)).toBe("supported");
        expect(pushSupport({ ...env, userAgent: iphone, hasPushManager: false, hasNotification: false })).toBe("ios-install");
        expect(pushSupport({ ...env, userAgent: iphone, standalone: true })).toBe("supported");
        expect(pushSupport({ ...env, hasPushManager: false })).toBe("unsupported");
    });

    it("предлагаем, пока не решал; «Не сейчас» — снова через 30 дней; отказ браузера — никогда", () => {
        const now = 1_000_000_000_000;
        expect(shouldOffer("default", null, now)).toBe(true);
        expect(shouldOffer("default", now - 1000, now)).toBe(false);
        expect(shouldOffer("default", now - OFFER_PAUSE_MS - 1, now)).toBe(true);
        expect(shouldOffer("denied", null, now)).toBe(false);
        expect(shouldOffer("granted", null, now)).toBe(false);
    });

    it("ключ VAPID из base64url в байты", () => {
        expect([...keyBytes("AQID_-8")]).toEqual([1, 2, 3, 255, 239]);
        expect(keyBytes("BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM").length).toBe(65);
    });
});

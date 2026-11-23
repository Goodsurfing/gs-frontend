import { describe, expect, it, vi } from "vitest";

import { keyBytes, OFFER_PAUSE_MS, pushSupport, shouldOffer, workerActivated } from "../webPush";

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

    it("запуск service worker: уже работает, запускается, сломался, завис", async () => {
        const worker = (state: ServiceWorkerState) => {
            const listeners = new Set<() => void>();
            return {
                state,
                addEventListener: (_: string, fn: () => void) => listeners.add(fn),
                removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
                go(next: ServiceWorkerState) { this.state = next; listeners.forEach((fn) => fn()); },
            };
        };
        const active = worker("activated");
        expect(await workerActivated({ active, installing: null, waiting: null })).toBe(true);
        expect(await workerActivated({ active: null, installing: null, waiting: null })).toBe(false);

        const installing = worker("installing");
        const started = workerActivated({ active: null, installing, waiting: null });
        installing.go("activated");
        expect(await started).toBe(true);

        const broken = worker("installing");
        const failed = workerActivated({ active: null, installing: broken, waiting: null });
        broken.go("redundant");
        expect(await failed).toBe(false);

        vi.useFakeTimers();
        const stuck = workerActivated({ active: null, installing: worker("installing"), waiting: null }, 1000);
        vi.advanceTimersByTime(1000);
        expect(await stuck).toBe(false);
        vi.useRealTimers();
    });
});

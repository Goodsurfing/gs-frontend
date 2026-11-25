import { describe, expect, it } from "vitest";

import { INSTALL_HINT_PAUSE_MS, INSTALL_HINT_REPEAT_MS, isIphoneSafari, isStandalone, parseTimestamp, shouldShowInstallHint } from "../pwa";

const safari = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const chromeIos = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1";
const yandexIos = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 YaBrowser/24.6.4.580.10 SA/3 Mobile/15E148 Safari/604.1";
const telegramIos = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
const ipad = "Mozilla/5.0 (iPad; CPU OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const android = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

const browser = { userAgent: safari, navigatorStandalone: false, displayModeStandalone: false };
const now = 1_800_000_000_000;
const fresh = { dismissedAt: null, shownAt: null, shownThisSession: false };

describe("сайт на экране «Домой»", () => {
    it("Safari на iPhone — да; Chrome, Яндекс, встроенные браузеры, iPad и Android — нет", () => {
        expect(isIphoneSafari(safari)).toBe(true);
        for (const ua of [chromeIos, yandexIos, telegramIos, ipad, android]) expect(isIphoneSafari(ua)).toBe(false);
    });

    it("открыт с экрана «Домой» — по navigator.standalone или display-mode", () => {
        expect(isStandalone({ displayModeStandalone: false })).toBe(false);
        expect(isStandalone({ navigatorStandalone: true, displayModeStandalone: false })).toBe(true);
        expect(isStandalone({ displayModeStandalone: true })).toBe(true);
    });

    it("плашка: Safari на iPhone, не установлен, «Позже» не нажимали 14 дней", () => {
        expect(shouldShowInstallHint(browser, fresh, now)).toBe(true);
        expect(shouldShowInstallHint({ ...browser, navigatorStandalone: true }, fresh, now)).toBe(false);
        expect(shouldShowInstallHint({ ...browser, displayModeStandalone: true }, fresh, now)).toBe(false);
        expect(shouldShowInstallHint({ ...browser, userAgent: chromeIos }, fresh, now)).toBe(false);
        expect(shouldShowInstallHint({ ...browser, userAgent: android }, fresh, now)).toBe(false);
        expect(shouldShowInstallHint(browser, { ...fresh, dismissedAt: now - 1000 }, now)).toBe(false);
        expect(shouldShowInstallHint(browser, { ...fresh, dismissedAt: now - INSTALL_HINT_PAUSE_MS - 1 }, now)).toBe(true);
        // «Позже» сильнее отметки визита
        expect(shouldShowInstallHint(browser, { ...fresh, dismissedAt: now - 1000, shownThisSession: true }, now)).toBe(false);
    });

    it("плашка: не чаще раза в 7 дней, в одном визите — на всех страницах", () => {
        expect(shouldShowInstallHint(browser, { ...fresh, shownAt: now - 1000 }, now)).toBe(false);
        expect(shouldShowInstallHint(browser, { ...fresh, shownAt: now - 1000, shownThisSession: true }, now)).toBe(true);
        expect(shouldShowInstallHint(browser, { ...fresh, shownAt: now - INSTALL_HINT_REPEAT_MS - 1 }, now)).toBe(true);
        expect(shouldShowInstallHint({ ...browser, displayModeStandalone: true }, { ...fresh, shownThisSession: true }, now)).toBe(false);
    });

    it("время «Позже» из хранилища: мусор — как не нажимали", () => {
        expect(parseTimestamp(null)).toBeNull();
        expect(parseTimestamp("abc")).toBeNull();
        expect(parseTimestamp("0")).toBeNull();
        expect(parseTimestamp(String(now))).toBe(now);
    });
});

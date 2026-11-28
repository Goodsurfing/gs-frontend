import { describe, expect, it } from "vitest";

import { CHUNK_LOAD_FINGERPRINT, filterBrowserEvent, isRobot } from "../robotFilter";

const UA = {
    chrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    yaBrowser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 YaBrowser/25.10.0.0 Safari/537.36",
    yaBrowserAndroid: "Mozilla/5.0 (Linux; arm_64; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 YaBrowser/25.10.1.90 Mobile Safari/537.36",
    yandexApp: "Mozilla/5.0 (Linux; arm_64; Android 13; 2201117TY) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 YaApp_Android/25.70.1 YaSearchBrowser/25.70.1 BroPP/1.0 SA/3 Mobile Safari/537.36",
    yandexSearch: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 YandexSearch/154.00 Mobile/15E148 Safari/605.1.15",
    safari: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
    firefox: "Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0",
    cubot: "Mozilla/5.0 (Linux; Android 12; CUBOT X50 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
    yandexRender: "Mozilla/5.0 (compatible; YandexRenderResourcesBot/1.0; +http://yandex.com/bots) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    yandexBot: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    yandexMetrika: "Mozilla/5.0 (compatible; YandexMetrika/2.0; +http://yandex.com/bots)",
    googlebot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/142.0.0.0 Safari/537.36",
    bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
    headless: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/142.0.0.0 Safari/537.36",
    crawler: "Mozilla/5.0 (compatible; SomeCrawler/1.0)",
    spider: "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
};

const chunkEvent = (value: string, type = "ChunkLoadError") => ({ exception: { values: [{ type, value }] } }) as { exception: { values: { type: string; value: string }[] }; fingerprint?: string[] };

describe("isRobot", () => {
    it("обычные браузеры, включая Яндекс.Браузер и приложение Яндекса, — не роботы", () => {
        for (const ua of [UA.chrome, UA.yaBrowser, UA.yaBrowserAndroid, UA.yandexApp, UA.yandexSearch, UA.safari, UA.firefox, UA.cubot]) {
            expect(isRobot(ua), ua).toBe(false);
        }
    });

    it("поисковые роботы, краулеры и безголовый Chrome — роботы", () => {
        for (const ua of [UA.yandexRender, UA.yandexBot, UA.yandexMetrika, UA.googlebot, UA.bingbot, UA.headless, UA.crawler, UA.spider]) {
            expect(isRobot(ua), ua).toBe(true);
        }
    });

    it("браузер под управлением программы (navigator.webdriver) — робот", () => {
        expect(isRobot(UA.chrome, true)).toBe(true);
    });
});

describe("filterBrowserEvent", () => {
    it("от роботов не отправляет никакие ошибки", () => {
        expect(filterBrowserEvent(chunkEvent("Failed to load chunk /_next/static/chunks/a1b2.js from module 72959"), UA.yandexRender)).toBeNull();
        expect(filterBrowserEvent(chunkEvent("x is not a function", "TypeError"), UA.googlebot)).toBeNull();
        expect(filterBrowserEvent(chunkEvent("x is not a function", "TypeError"), UA.chrome, true)).toBeNull();
    });

    it("ChunkLoadError у людей — одна задача без хэша на все релизы", () => {
        const first = filterBrowserEvent(chunkEvent("Failed to load chunk /_next/static/chunks/a1b2.js from module 72959"), UA.yaBrowser);
        const second = filterBrowserEvent(chunkEvent("Failed to load chunk /_next/static/chunks/c3d4.js from module 1234"), UA.chrome);
        expect(first?.fingerprint).toEqual(CHUNK_LOAD_FINGERPRINT);
        expect(second?.fingerprint).toEqual(CHUNK_LOAD_FINGERPRINT);
    });

    it("другие тексты ошибки загрузки чанка — тот же отпечаток", () => {
        for (const [value, type] of [
            ["Loading chunk 123 failed.", "Error"],
            ["Failed to fetch dynamically imported module: https://goodsurfing.org/_next/static/chunks/x.js", "TypeError"],
            ["Failed to load chunk /_next/static/chunks/a1b2.js from module 72959", "Error"],
        ] as const) {
            expect(filterBrowserEvent(chunkEvent(value, type), UA.safari)?.fingerprint, value).toEqual(CHUNK_LOAD_FINGERPRINT);
        }
        expect(filterBrowserEvent({ message: "ChunkLoadError: Loading chunk 5 failed" } as { message: string; fingerprint?: string[] }, UA.chrome)?.fingerprint)
            .toEqual(CHUNK_LOAD_FINGERPRINT);
    });

    it("остальные ошибки людей уходят как есть, группировка по умолчанию", () => {
        const event = chunkEvent("Cannot read properties of undefined", "TypeError");
        expect(filterBrowserEvent(event, UA.chrome)).toBe(event);
        expect(event.fingerprint).toBeUndefined();
        expect(filterBrowserEvent(chunkEvent("Failed to fetch", "TypeError"), UA.chrome)?.fingerprint).toBeUndefined();
    });
});

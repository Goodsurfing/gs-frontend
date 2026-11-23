import { describe, expect, it } from "vitest";

import { pageTampering, parseUserAgent } from "../browserContext";

const UA = {
    yandex: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 YaBrowser/25.8.0.0 Safari/537.36",
    chromeAndroid: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
    safariIos: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    chromeIos: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.0.0 Mobile/15E148 Safari/604.1",
    firefoxMac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:144.0) Gecko/20100101 Firefox/144.0",
    edge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0",
};

describe("parseUserAgent", () => {
    it("узнаёт браузер раньше Chrome, на котором он построен", () => {
        expect(parseUserAgent(UA.yandex)).toEqual({ browser: "Yandex Browser 25", os: "Windows" });
        expect(parseUserAgent(UA.edge)).toEqual({ browser: "Edge 142", os: "Windows" });
    });

    it("телефоны", () => {
        expect(parseUserAgent(UA.chromeAndroid)).toEqual({ browser: "Chrome 142", os: "Android" });
        expect(parseUserAgent(UA.safariIos)).toEqual({ browser: "Safari 18", os: "iOS" });
        expect(parseUserAgent(UA.chromeIos)).toEqual({ browser: "Chrome 142", os: "iOS" });
    });

    it("Firefox и неизвестное", () => {
        expect(parseUserAgent(UA.firefoxMac)).toEqual({ browser: "Firefox 144", os: "macOS" });
        expect(parseUserAgent("curl/8.0")).toEqual({ browser: "other", os: "other" });
    });
});

type Attrs = Record<string, string>;
const element = (tagName: string, attrs: Attrs, fontTranslated = false) => ({
    tagName: tagName.toUpperCase(),
    attributes: Object.entries(attrs).map(([name, value]) => ({ name, value })),
    getAttribute: (name: string) => attrs[name] ?? null,
    hasAttribute: (name: string) => name in attrs,
    querySelector: () => (fontTranslated ? {} : null),
});
const doc = (html: Attrs, body: Attrs, fontTranslated = false) =>
    ({ documentElement: element("html", html), body: element("body", body, fontTranslated) }) as unknown as Document;

describe("pageTampering", () => {
    it("чистая страница", () => {
        expect(pageTampering(doc({ lang: "ru" }, { style: "pointer-events: none", "data-scroll-locked": "1" }), "ru"))
            .toEqual({ translated: false, foreignAttributes: [] });
    });

    it("переводчик Google: класс translated-ltr и другой lang", () => {
        expect(pageTampering(doc({ lang: "en", class: "translated-ltr" }, {}), "ru"))
            .toEqual({ translated: true, foreignAttributes: ["html[class]"] });
    });

    it("переводчик, оставивший lang, узнаётся по вставкам <font>", () => {
        expect(pageTampering(doc({ lang: "ru" }, {}, true), "ru").translated).toBe(true);
    });

    it("расширения — только имена атрибутов, без значений", () => {
        const result = pageTampering(doc({ lang: "ru", "data-darkreader-mode": "dynamic" }, { "data-gr-ext-installed": "", "data-new-gr-c-s-check-loaded": "14.1" }), "ru");
        expect(result.translated).toBe(false);
        expect(result.foreignAttributes).toEqual(["html[data-darkreader-mode]", "body[data-gr-ext-installed]", "body[data-new-gr-c-s-check-loaded]"]);
    });
});

import {
    describe, it, expect, vi,
} from "vitest";
import { browserFamily, installDomTranslationGuard, isPageTranslatedByBrowser } from "./domTranslationGuard";

describe("installDomTranslationGuard", () => {
    it("removeChild чужого узла не бросает исключение (как после перевода страницы)", () => {
        installDomTranslationGuard();
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const parent = document.createElement("div");
        const child = document.createElement("span");
        parent.appendChild(child);
        // Переводчик перенёс узел в свою обёртку
        const font = document.createElement("font");
        parent.replaceChild(font, child);
        font.appendChild(child);

        expect(() => parent.removeChild(child)).not.toThrow();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it("обычный removeChild работает как раньше", () => {
        installDomTranslationGuard();
        const parent = document.createElement("div");
        const child = document.createElement("span");
        parent.appendChild(child);

        parent.removeChild(child);

        expect(parent.childNodes.length).toBe(0);
    });

    it("insertBefore с чужим опорным узлом не бросает исключение", () => {
        installDomTranslationGuard();
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const parent = document.createElement("div");
        const stranger = document.createElement("span");

        expect(() => parent.insertBefore(document.createElement("b"), stranger)).not.toThrow();
        warn.mockRestore();
    });
});

describe("isPageTranslatedByBrowser / browserFamily", () => {
    it("узнаёт перевод по классу Google Переводчика и по <font>", () => {
        const doc = document.implementation.createHTMLDocument("t");
        doc.body.innerHTML = "<div id=\"root\"><p>текст</p></div>";
        expect(isPageTranslatedByBrowser(doc)).toBe(false);
        doc.documentElement.className = "translated-ltr";
        expect(isPageTranslatedByBrowser(doc)).toBe(true);

        const doc2 = document.implementation.createHTMLDocument("t");
        doc2.body.innerHTML = "<div id=\"root\"><p><font><font>text</font></font></p></div>";
        expect(isPageTranslatedByBrowser(doc2)).toBe(true);
    });

    it("определяет семейство браузера", () => {
        expect(browserFamily("Mozilla/5.0 Chrome/120 YaBrowser/24.1 Safari/537")).toBe("yandex");
        expect(browserFamily("Mozilla/5.0 Chrome/120 Safari/537")).toBe("chrome");
        expect(browserFamily("Mozilla/5.0 Version/17 Safari/605")).toBe("safari");
    });
});

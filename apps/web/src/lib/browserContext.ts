/**
 * Контекст браузера для событий Bugsink (GS-272). Заголовки запросов мы в
 * Bugsink не шлём (без ПДн), поэтому браузер и ОС там не видны — и нельзя
 * отличить нашу ошибку гидрации (#418) от вмешательства переводчика или
 * расширения. Здесь — только тип браузера, ОС и признаки чужих правок
 * страницы; ничего о самом человеке.
 */

export type BrowserInfo = { browser: string; os: string };

const BROWSERS: [RegExp, string][] = [
    [/YaBrowser\/(\d+)/, "Yandex Browser"],
    [/Edg(?:A|iOS)?\/(\d+)/, "Edge"],
    [/OPR\/(\d+)/, "Opera"],
    [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
    [/(?:Firefox|FxiOS)\/(\d+)/, "Firefox"],
    [/(?:Chrome|CriOS)\/(\d+)/, "Chrome"],
    [/Version\/(\d+)[\d.]* (?:Mobile\/\S+ )?Safari/, "Safari"],
];

const SYSTEMS: [RegExp, string][] = [
    [/Android/, "Android"],
    [/iPhone|iPad|iPod/, "iOS"],
    [/Windows/, "Windows"],
    [/Mac OS X|Macintosh/, "macOS"],
    [/CrOS/, "ChromeOS"],
    [/Linux/, "Linux"],
];

/** «Chrome 142», «iOS» — по строке User-Agent; неизвестное — «other» */
export function parseUserAgent(ua: string): BrowserInfo {
    let browser = "other";
    for (const [pattern, name] of BROWSERS) {
        const match = ua.match(pattern);
        if (match) {
            browser = `${name} ${match[1]}`;
            break;
        }
    }
    const os = SYSTEMS.find(([pattern]) => pattern.test(ua))?.[1] ?? "other";
    return { browser, os };
}

/**
 * Атрибуты <html>/<body>, которые ставим мы сами: lang — layout, style и
 * data-scroll-locked — Radix на время открытой модалки. Остальное (class,
 * data-gr-*, data-darkreader-* и т. п.) — чужое.
 */
const OWN_ATTRIBUTES = new Set(["lang", "style", "data-scroll-locked"]);

/**
 * Признаки того, что страницу правил кто-то кроме нас: переводчик браузера
 * (Google/Яндекс/Safari) или расширения (Grammarly, Dark Reader и т. п.
 * добавляют атрибуты на <html>/<body>). Только имена атрибутов, без значений.
 */
export function pageTampering(doc: Pick<Document, "documentElement" | "body">, pageLang: string | null): { translated: boolean; foreignAttributes: string[] } {
    const html = doc.documentElement;
    const htmlClass = html.getAttribute("class") ?? "";
    const lang = html.getAttribute("lang");
    const translated = /\btranslated-(?:ltr|rtl)\b/.test(htmlClass)
        || (pageLang !== null && lang !== null && lang !== pageLang)
        || html.hasAttribute("xmlns:yt")
        || doc.body?.querySelector?.("font[style*='vertical-align']") != null;
    const foreignAttributes = [html, doc.body]
        .filter(Boolean)
        .flatMap((element) => Array.from(element.attributes)
            .map((attribute) => attribute.name)
            .filter((name) => !OWN_ATTRIBUTES.has(name))
            .map((name) => `${element.tagName.toLowerCase()}[${name}]`));
    return { translated, foreignAttributes };
}

/** Язык, с которым сервер отдал страницу (до того как переводчик поменяет lang) */
export function capturePageLang(doc: Pick<Document, "documentElement">): string | null {
    return doc.documentElement.getAttribute("lang");
}

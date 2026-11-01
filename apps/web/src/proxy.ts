import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, localeFromPath, stripLocale } from "@/i18n/config";
import { LOCALE_HEADER } from "@/i18n/request";

/**
 * Адреса без префикса для русского (src/i18n/config.ts):
 * - /ru, /ru/… — 301 на адрес без префикса (ссылки из писем, закладки, поиск);
 * - /en/…, /es/… — как есть;
 * - остальное — русский: внутри переписывается на маршрут [locale]=ru, так что
 *   страницы остаются статическими (ISR).
 * Язык передаётся в заголовке для app/global-not-found.tsx — параметров
 * маршрута она не получает.
 */
// Метка уже переписанного запроса: Next прогоняет через proxy и его, и без
// метки внутренний /ru/… снова получил бы 301 (бесконечный редирект)
const REWRITTEN = "x-gs-rewritten";

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    if (request.headers.get(REWRITTEN) === "1") {
        return NextResponse.next();
    }

    if (/^\/ru(?=\/|$)/.test(pathname)) {
        const target = request.nextUrl.clone();
        target.pathname = stripLocale(pathname);
        target.search = search;
        return NextResponse.redirect(target, 301);
    }

    const locale = localeFromPath(pathname);
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, locale);

    if (locale === DEFAULT_LOCALE) {
        const internal = request.nextUrl.clone();
        internal.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
        headers.set(REWRITTEN, "1");
        return NextResponse.rewrite(internal, { request: { headers } });
    }
    return NextResponse.next({ request: { headers } });
}

export const config = {
    // Только страницы: ассеты Next, статика нового фронта и /healthz идут мимо
    matcher: ["/((?!_next/|web/|healthz|.*\\.[a-z0-9]+$).*)"],
};

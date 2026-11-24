import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, localeFromPath, stripLocale } from "@/i18n/config";
import { LOCALE_HEADER } from "@/i18n/request";
import { isUuid } from "@/lib/entityId";
import { legacyOffersListTarget } from "@/lib/legacyOffersLink";
import { legacyBackendPath, legacyRedirect } from "@/lib/legacyRedirects";
import { routes } from "@/lib/routes";

/**
 * Адреса без префикса для русского (src/i18n/config.ts):
 * - /ru, /ru/… — 301 на адрес без префикса (ссылки из писем, закладки, поиск);
 * - /en/…, /es/… — как есть;
 * - старые адреса (lib/legacyRedirects.ts) — 301 на новые;
 * - ссылки старого каталога из рекламы `/offers/2?host_categories=…` — на карту
 *   вакансий (lib/legacyOffersLink.ts). Здесь, а не на странице вакансии:
 *   чтение searchParams там делает кэшируемую (ISR) страницу динамической; те, что переводит только
 *   бэкенд по базе (/offers/host/:id, /blog/article/:id), — проксируются на API;
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

    // Испорченная кодировка в адресе (%C0%AF — попытки выйти из каталога, оборванное %A):
    // страница падала с 500 на разборе параметра. Это ошибка запроса — 400 (18.11.2026)
    if (isMalformedPath(pathname)) {
        return new NextResponse("Bad Request", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    // Сюда попадают и файлы с «%» в адресе (второе правило matcher) — их отдаём как есть
    if (/^\/(_next|web)\//.test(pathname) || /\.[a-z0-9]+$/i.test(pathname)) {
        return NextResponse.next();
    }

    if (/^\/ru(?=\/|$)/.test(pathname)) {
        const target = request.nextUrl.clone();
        target.pathname = stripLocale(pathname);
        target.search = search;
        return NextResponse.redirect(target, 301);
    }

    const backendPath = legacyBackendPath(pathname);
    if (backendPath) {
        // Адрес на стороне сервера (внутри Docker), иначе публичный API
        const api = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "https://api-staging.goodsurfing.org";
        return NextResponse.rewrite(new URL(`${backendPath}${search}`, api));
    }

    const legacy = legacyRedirect(pathname);
    if (legacy) {
        const target = request.nextUrl.clone();
        target.pathname = legacy;
        target.search = search;
        return NextResponse.redirect(target, 301);
    }

    const locale = localeFromPath(pathname);

    // Шаблон ссылки вместо id (/offers/{id}): страницы передают такие шаблоны в разметку,
    // поисковики находят их и ходят по ним. Раньше — 200 с пустой страницей и запрос
    // в API с «{id}» (ошибка в Bugsink, 15.11.2026). Теперь — сразу 404
    if (isTemplatePath(pathname)) {
        const notFound = request.nextUrl.clone();
        notFound.pathname = `/${locale}/__not-found`;
        const notFoundHeaders = new Headers(request.headers);
        notFoundHeaders.set(LOCALE_HEADER, locale);
        notFoundHeaders.set(REWRITTEN, "1");
        return NextResponse.rewrite(notFound, { request: { headers: notFoundHeaders } });
    }

    if (/^(\/(en|es))?\/offers\/\d+\/?$/.test(pathname)) {
        const target = legacyOffersListTarget(Object.fromEntries(request.nextUrl.searchParams), routes.offersMap(locale));
        if (target) return NextResponse.redirect(new URL(target, request.url), 301);
    }

    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, locale);
    // Страница сама рисует «не найдено» в каркасе, а код 404 ставим здесь (GS-302): у динамических
    // страниц NotFoundStatus не меняет код — заголовки уже отправлены
    const status = isMissingDynamicPath(pathname) ? 404 : undefined;

    if (locale === DEFAULT_LOCALE) {
        const internal = request.nextUrl.clone();
        internal.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
        headers.set(REWRITTEN, "1");
        return NextResponse.rewrite(internal, { request: { headers }, status });
    }
    if (status) {
        headers.set(REWRITTEN, "1");
        return NextResponse.rewrite(request.nextUrl, { request: { headers }, status });
    }
    return NextResponse.next({ request: { headers } });
}

/** Путь не раскодируется: неверные %-последовательности или не UTF-8 */
export function isMalformedPath(pathname: string): boolean {
    try {
        decodeURIComponent(pathname);
        return false;
    } catch {
        return true;
    }
}

/**
 * Динамическая страница (без кэша) с id не того вида — сбора или курса заведомо нет (GS-302).
 * У страниц с кэшем (вакансия, организация, статьи) код 404 ставит сама страница
 * (components/errors/NotFoundStatus.tsx) — по ответу API, а у этих двух сбор и курс с UUID,
 * которых нет, остаются 200 с noindex: проверка по базе здесь стоила бы лишнего запроса к API.
 */
export function isMissingDynamicPath(pathname: string): boolean {
    const match = /^(?:\/(?:en|es))?\/(?:fundraise|academy-course)\/([^/]+)\/?$/.exec(pathname);
    if (!match?.[1]) return false;
    let id: string;
    try {
        id = decodeURIComponent(match[1]);
    } catch {
        return true;
    }
    return !isUuid(id);
}

/** В пути остался шаблон: {id}, %7Bid%7D */
export function isTemplatePath(pathname: string): boolean {
    return /[{}]|%7B|%7D/i.test(pathname);
}

export const config = {
    // Только страницы: ассеты Next, статика нового фронта и /healthz идут мимо
    // Второе правило — любые адреса с «%»: испорченная кодировка в адресе «файла»
    // (/..%C0%AF.env) иначе шла мимо proxy и роняла страницу с 500
    matcher: ["/((?!_next/|web/|healthz|.*\\.[a-z0-9]+$).*)", "/(.*%.*)"],
};

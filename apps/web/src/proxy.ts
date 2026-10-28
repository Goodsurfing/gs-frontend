import { type NextRequest, NextResponse } from "next/server";

import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { LOCALE_HEADER } from "@/i18n/request";

/**
 * Передаёт язык адреса в заголовке запроса: корневой not-found.tsx
 * (страница 404) параметров маршрута не получает.
 */
export function proxy(request: NextRequest) {
    const segment = request.nextUrl.pathname.split("/")[1] ?? "";
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, isLocale(segment) ? segment : DEFAULT_LOCALE);
    return NextResponse.next({ request: { headers } });
}

export const config = {
    // Только страницы: ассеты Next, статика и /healthz идут мимо
    matcher: ["/((?!_next/|healthz|icons/|fonts/|locales/|.*\\.[a-z0-9]+$).*)"],
};

import { type NextRequest, NextResponse } from "next/server";

const COOKIE = "gs_web";
// На стенде новый фронт видят только с этой cookie (канарейка в Traefik)
const MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Включить / выключить просмотр нового фронта на стенде без консоли браузера:
 *   /web/preview?to=/offers-map   — включить и перейти на страницу
 *   /web/preview?off              — выключить
 * Переход — только внутри сайта (адрес с одним «/» в начале).
 */
export function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const to = params.get("to") ?? "/";
    // Относительный адрес: за прокси origin запроса — внутренний адрес контейнера
    const response = new NextResponse(null, { status: 302, headers: { Location: /^\/(?!\/)/.test(to) ? to : "/" } });
    if (params.has("off")) {
        response.cookies.delete(COOKIE);
    } else {
        response.cookies.set(COOKIE, "1", { path: "/", maxAge: MAX_AGE, sameSite: "lax", secure: request.headers.get("x-forwarded-proto") === "https" || request.nextUrl.protocol === "https:" });
    }
    return response;
}

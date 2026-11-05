/**
 * Сохранение входа в браузере. Пока кабинеты и часть страниц — в старом
 * SPA, вход пишется в его формате (localStorage, значения JSON-строками;
 * см. entities/User/model/slice/userSlice.ts в корне): иначе после входа
 * в новом фронте старое SPA считало бы пользователя гостем. Cookie входа
 * (GS-218) бэкенд ставит сам, если она включена.
 */
export interface TokenResponse {
    accessToken: string;
    mercureToken?: string;
    refresh_token?: string;
    roles?: string[];
}

export function saveSession(data: TokenResponse, username: string) {
    const set = (key: string, value: unknown) => window.localStorage.setItem(key, JSON.stringify(value));
    set("user", { username });
    set("token", data.accessToken);
    set("mercureToken", data.mercureToken ?? "");
    set("roles", data.roles ?? ["ROLE_USER"]);
    if (data.refresh_token) set("refreshToken", data.refresh_token);
}

/** Куда вернуть после входа (?next=&nextId=) — как useNextRoutes старого фронта, плюс сбор пожертвований */
export function nextRoute(prefix: string, next: string | null, nextId: string | null): string | null {
    // Готовый путь этого сайта (?next=/offers/5) — например, из письма-подтверждения почты
    if (next && !nextId) return safeSitePath(next);
    if (!next || !nextId) return null;
    const id = encodeURIComponent(nextId);
    switch (next) {
        case "offer": return `${prefix}/offers/${id}`;
        case "host": return `${prefix}/organizations/${id}`;
        case "messenger": return `${prefix}/messenger/create/${id}`;
        case "volunteer": return `${prefix}/volunteers/${id}`;
        case "payment": return `${prefix}/payment?tariff=${id}`;
        case "donation": return `${prefix}/fundraise/${id}`;
        case "duo": return `${prefix}/membership/duo/${id}`;
        // Подписка на подборку: вернуть на карту с теми же фильтрами (nextId — строка параметров)
        case "offersMap": return `${prefix}/offers-map?${new URLSearchParams(nextId).toString()}`;
        default: return null;
    }
}

/** Только путь этого сайта: «/offers/5», «/en/offers-map?category=1» — не чужой домен и не «//» */
export function safeSitePath(value: string | null | undefined): string | null {
    if (!value || value.length > 300 || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
    return /^\/[A-Za-z0-9/_\-.~%?=&,]*$/.test(value) ? value : null;
}

const PENDING_NEXT = "gs_auth_next";

/**
 * Куда вернуть после входа или регистрации. Берётся из адреса (?next=&nextId=);
 * его же помним в sessionStorage — вход через VK возвращает на страницу входа
 * со своими параметрами, и без этого человек терял вакансию (05.11.2026).
 */
export function returnAfterAuth(prefix: string): string | null {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = nextRoute(prefix, params.get("next"), params.get("nextId"));
    try {
        if (fromUrl) window.sessionStorage.setItem(PENDING_NEXT, fromUrl);
        return fromUrl ?? safeSitePath(window.sessionStorage.getItem(PENDING_NEXT));
    } catch {
        return fromUrl;
    }
}

export function forgetReturnAfterAuth() {
    try {
        window.sessionStorage.removeItem(PENDING_NEXT);
    } catch {
        // без sessionStorage — нечего забывать
    }
}

/** Параметры возврата из текущего адреса — чтобы перенести их со входа на регистрацию и обратно */
export function authReturnQuery(): string {
    const params = new URLSearchParams(window.location.search);
    const keep = new URLSearchParams();
    for (const key of ["next", "nextId"]) {
        const value = params.get(key);
        if (value) keep.set(key, value);
    }
    const query = keep.toString();
    return query ? `?${query}` : "";
}

/** Переход между входом и регистрацией с теми же параметрами возврата (клик по ссылке) */
export function keepReturn(event: { preventDefault: () => void }, href: string) {
    const query = authReturnQuery();
    if (!query) return;
    event.preventDefault();
    // Страницы входа и регистрации — полная загрузка, как и их обычные ссылки
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `${href}${query}`;
}

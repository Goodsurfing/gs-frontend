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
    if (!next || !nextId) return null;
    const id = encodeURIComponent(nextId);
    switch (next) {
        case "offer": return `${prefix}/offers/${id}`;
        case "host": return `${prefix}/organizations/${id}`;
        case "messenger": return `${prefix}/messenger/create/${id}`;
        case "volunteer": return `${prefix}/volunteers/${id}`;
        case "payment": return `${prefix}/payment?tariff=${id}`;
        case "donation": return `${prefix}/fundraise/${id}`;
        default: return null;
    }
}

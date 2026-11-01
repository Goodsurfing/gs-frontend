/**
 * Сессия старого SPA в localStorage (тот же домен). Пока разделы живут в
 * двух фронтах, вход, сделанный до появления cookie (GS-218), виден только
 * там — новый фронт берёт оттуда токен, чтобы не показывать «Вход»
 * вошедшему пользователю. Значения лежат JSON-строками.
 */
const KEYS = ["user", "roles", "token", "mercureToken", "refreshToken"] as const;

const read = (key: string): string | null => {
    try {
        const raw = window.localStorage.getItem(key);
        const value: unknown = raw ? JSON.parse(raw) : null;
        return typeof value === "string" && value !== "" ? value : null;
    } catch {
        return null;
    }
};

export const legacyAccessToken = () => read("token");
export const legacyRefreshToken = () => read("refreshToken");

/** Выход сразу из обоих фронтов: иначе старое SPA осталось бы с входом. */
export const clearLegacySession = () => {
    for (const storage of [window.localStorage, window.sessionStorage]) {
        for (const key of KEYS) storage.removeItem(key);
    }
};

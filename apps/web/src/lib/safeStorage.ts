/**
 * localStorage и sessionStorage, которых может не быть. В части браузеров
 * (приватный режим, встроенные браузеры приложений, запрет cookie) сам доступ к
 * `window.localStorage` бросает исключение или возвращает null — страница падала
 * с «null is not an object (evaluating 'window.localStorage.getItem')» (18.11).
 * Без хранилища сайт работает как при пустом хранилище: черновики и отметки
 * просто не запоминаются.
 */
export type StorageKind = "local" | "session";

/** Само хранилище или null, если браузер его не даёт */
export function browserStorage(kind: StorageKind = "local"): Storage | null {
    if (typeof window === "undefined") return null;
    try {
        return (kind === "local" ? window.localStorage : window.sessionStorage) ?? null;
    } catch {
        return null;
    }
}

export function storageGet(key: string, kind: StorageKind = "local"): string | null {
    try {
        return browserStorage(kind)?.getItem(key) ?? null;
    } catch {
        return null;
    }
}

/** Переполнение и запрет записи молча пропускаем — это не повод ломать страницу */
export function storageSet(key: string, value: string, kind: StorageKind = "local"): void {
    try {
        browserStorage(kind)?.setItem(key, value);
    } catch {
        // хранилище недоступно или переполнено
    }
}

export function storageRemove(key: string, kind: StorageKind = "local"): void {
    try {
        browserStorage(kind)?.removeItem(key);
    } catch {
        // хранилище недоступно
    }
}

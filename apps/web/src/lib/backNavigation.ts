import { normalizePath } from "@/lib/currentPage";
import { storageGet, storageSet } from "@/lib/safeStorage";

/**
 * Куда ведёт стрелка «Назад» на странице отклика (сдача тестировщицы 27.11.2026:
 * стрелка уводила в «Сообщения», а не к вакансии).
 *
 * Сайт запоминает в sessionStorage вкладки текущую и предыдущую страницу
 * (`NavigationTrail` в `[locale]/layout.tsx`). Если перед откликом человек был
 * на нашем сайте — возвращаем его шагом истории браузера туда, откуда пришёл
 * (карточка вакансии, карта, избранное), с прокруткой и фильтрами. Если
 * пришёл по ссылке из письма, из поиска или после входа — шага назад на сайте
 * нет, ведём на карточку вакансии.
 */
const KEY = "gs_nav_trail";

interface Trail { previous: string | null; current: string }

const readTrail = (): Trail | null => {
    try {
        const value = JSON.parse(storageGet(KEY, "session") ?? "null") as Partial<Trail> | null;
        return value && typeof value.current === "string" ? { previous: typeof value.previous === "string" ? value.previous : null, current: value.current } : null;
    } catch {
        return null;
    }
};

/** Новая страница во вкладке. Перезагрузка той же страницы предыдущую не затирает */
export function recordPage(pathname: string): void {
    const trail = readTrail();
    if (trail?.current === pathname) return;
    storageSet(KEY, JSON.stringify({ previous: trail?.current ?? null, current: pathname }), "session");
}

/** Предыдущая страница сайта в этой вкладке (адрес как в браузере) или null */
export function previousPage(): string | null {
    return readTrail()?.previous ?? null;
}

/** Страницы входа и подтверждения: возвращаться на них стрелкой «Назад» незачем */
const NOT_BACK = /^\/(signin|signup|sign-in|sign-up|reset-password|reset-password-verify|confirm-email|confirm-email-success|confirm-error|email-already-confirmed|email-expired|verify-email|verify-email-hash|messenger\/create)(\/|$)/;

/**
 * Можно ли вернуться шагом истории: предыдущая страница — с нашего сайта, не
 * вход и не сам отклик, и в истории вкладки есть куда шагнуть.
 */
export function canGoBackTo(previous: string | null, historyLength: number): boolean {
    if (!previous || historyLength < 2 || !previous.startsWith("/") || previous.startsWith("//")) return false;
    return !NOT_BACK.test(normalizePath(previous));
}

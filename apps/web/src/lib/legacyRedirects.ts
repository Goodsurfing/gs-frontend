import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";

const PERSONAL: Record<string, (l: Locale, id: string) => string> = {
    offer: routes.offer,
    host: routes.organization,
    volunteer: routes.volunteerPublic,
    donation: routes.fundraise,
};

/**
 * Старые адреса, которые до 04.11 перенаправляло старое SPA (уже в браузере, после
 * ответа 200) или показывало вместо них пустую страницу. Здесь — настоящий 301 с
 * сервера: поисковики переносят вес ссылки, а неизвестные адреса получают честную 404.
 * - /offer-personal/:id, /host-personal/:id, /volunteer-personal/:id, /donation-personal/:id —
 *   адреса старого SPA до переезда на вложенные пути;
 * - /offers/index, /offers/host — списки вакансий со старого сайта (Yii2) → карта вакансий;
 * - /en|es/offers/host/:legacyId — старая вакансия с префиксом языка → /offers/host/:legacyId,
 *   его бэкенд переводит в актуальный id (старый сайт языков в адресе не различал).
 */
export function legacyRedirect(pathname: string): string | null {
    const personal = /^\/(?:(en|es)\/)?(offer|host|volunteer|donation)-personal\/([^/]+)\/?$/.exec(pathname);
    if (personal) {
        const [, locale, kind, id] = personal;
        const to = kind && PERSONAL[kind];
        return to && id ? to((locale as Locale | undefined) ?? DEFAULT_LOCALE, id) : null;
    }
    const list = /^\/(?:(en|es)\/)?offers\/(?:index|host)\/?$/.exec(pathname);
    if (list) return routes.offersMap((list[1] as Locale | undefined) ?? DEFAULT_LOCALE);
    const legacyOffer = /^\/(?:en|es)\/offers\/host\/(\d+)\/?$/.exec(pathname);
    if (legacyOffer) return `/offers/host/${legacyOffer[1]}`;
    return null;
}

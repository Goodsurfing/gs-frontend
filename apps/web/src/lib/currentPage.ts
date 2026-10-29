import { stripLocale } from "@/i18n/config";

const normalize = (path: string) => stripLocale(path.split(/[?#]/)[0] ?? "").replace(/\/+$/, "") || "/";

/**
 * Ведёт ли внутренняя ссылка `href` на открытую страницу. Язык не учитывается:
 * у ссылок меню он всегда тот же, что у страницы, а `pathname` для русского
 * может прийти и без префикса, и с `/ru` (внутренний rewrite в proxy.ts).
 */
export const isSamePage = (pathname: string, href: string): boolean => {
    if (!href.startsWith("/") || href.startsWith("//")) return false;
    return normalize(pathname) === normalize(href);
};

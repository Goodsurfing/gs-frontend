const normalize = (path: string) => path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";

/**
 * Ведёт ли внутренняя ссылка `to` на текущую страницу `pathname`.
 * Внешние адреса (https://…) и якоря текущей страницей не считаются.
 */
export const isCurrentPath = (pathname: string, to: string): boolean => {
    if (!to.startsWith("/") || to.startsWith("//")) return false;
    return normalize(pathname) === normalize(to);
};

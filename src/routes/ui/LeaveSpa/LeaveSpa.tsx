import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import Preloader from "@/shared/ui/Preloader/Preloader";

/** Адрес, с которым SPA загрузилась (его отдал сервер) */
const INITIAL_PATH = typeof window === "undefined" ? "" : window.location.pathname;

/**
 * В старом SPA осталась только админка, остальной сайт — новый фронт
 * (apps/web), Traefik отправляет туда все его адреса. Переход внутри SPA на
 * такой адрес (ссылка из админки на вакансию, профиль) роутер SPA не знает:
 * перезагружаем страницу, и сервер отдаёт её из нового фронта. Если же SPA
 * загрузилась прямо с этим адресом, сервер не нашёл его и в новом фронте —
 * это настоящая 404.
 */
export const shouldLeaveSpa = (pathname: string, initialPath: string) => pathname !== initialPath;

export const LeaveSpa = () => {
    const { pathname, search, hash } = useLocation();
    const leave = shouldLeaveSpa(pathname, INITIAL_PATH);

    useEffect(() => {
        if (leave) window.location.assign(`${pathname}${search}${hash}`);
    }, [leave, pathname, search, hash]);

    return leave ? <Preloader /> : <NotFoundPage />;
};

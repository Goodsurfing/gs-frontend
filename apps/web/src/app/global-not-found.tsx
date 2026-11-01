import type { Metadata } from "next";
import { headers } from "next/headers";

import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { NotFound } from "@/components/NotFound";
import { PublicShell } from "@/components/layout/PublicShell";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { LOCALE_HEADER } from "@/i18n/request";

import "./globals.css";

/**
 * Страница 404 для неизвестных адресов (experimental.globalNotFound): настоящий
 * код 404 и noindex — старое SPA отдавало 200, и поисковики считали
 * несуществующие адреса страницами.
 *
 * Почему не [locale]/not-found.tsx: Next вкладывает not-found в данные каждой
 * страницы раздела (+30 КБ), а 404 от notFound() отдаёт пустой оболочкой с
 * дорисовкой в браузере. global-not-found работает на уровне маршрутизации и
 * рисуется на сервере целиком. Язык — из заголовка от proxy.ts; чтение
 * заголовка делает динамической только эту страницу.
 */
export const metadata: Metadata = {
    title: "GoodSurfing",
    icons: { icon: "/favicon.png" },
};

export default async function RootNotFound() {
    const value = (await headers()).get(LOCALE_HEADER) ?? "";
    const locale = isLocale(value) ? value : DEFAULT_LOCALE;
    const t = await getTranslator(locale);

    return (
        <html lang={locale}>
            <body>
                <PublicShell locale={locale} headerVariant="static">
                    <NotFound locale={locale} t={t} />
                </PublicShell>
                <YandexMetrika />
            </body>
        </html>
    );
}

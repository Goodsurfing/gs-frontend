import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { isLocale, LOCALES } from "@/i18n/config";

import "../globals.css";

export const metadata: Metadata = {
    title: "GoodSurfing",
    icons: { icon: "/favicon.png" },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://goodsurfing.org"),
};

// Другие первые сегменты — не язык: такие адреса уходят в app/global-not-found.tsx
// Неизвестный язык отсекает isLocale → notFound() ниже. dynamicParams = false здесь
// не ставим: он распространяется на все страницы и превращал в 404 вакансии и
// статьи, когда у них появился кэш (generateStaticParams).
export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

/**
 * Битая картинка → заглушка «Изображение недоступно», как глобальный обработчик
 * старого SPA (src/index.tsx: файлы, потерянные при переезде в S3). Встроенный
 * скрипт первым в body — ловит ошибки и тех картинок, что грузятся до гидратации.
 * В начале — замена AbortSignal.timeout для старых браузеров (Safari до 16): без
 * неё проверка входа падала с «AbortSignal.timeout is not a function».
 * Он же отмечает загруженные картинки (data-loaded): пока метки нет, на месте
 * картинки из хранилища — мерцающая заглушка, потом картинка плавно
 * проявляется (globals.css, «Загрузка картинок»). На медленном интернете вместо
 * пустых дыр видно, что здесь будет фото.
 */
const BROKEN_IMAGE_FALLBACK = `if(typeof AbortSignal!=="undefined"&&!AbortSignal.timeout){AbortSignal.timeout=function(ms){var c=new AbortController();setTimeout(function(){try{c.abort(new DOMException("signal timed out","TimeoutError"));}catch(e){c.abort();}},ms);return c.signal;};}document.addEventListener("error",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&!t.dataset.fallback){t.dataset.fallback="true";t.src="/web/images/placeholder-missing.svg";}},true);document.addEventListener("load",function(e){var t=e.target;if(t&&t.tagName==="IMG")t.setAttribute("data-loaded","");},true);`;

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <html lang={locale}>
            <body>
                <script dangerouslySetInnerHTML={{ __html: BROKEN_IMAGE_FALLBACK }} />
                {children}
                <YandexMetrika />
            </body>
        </html>
    );
}

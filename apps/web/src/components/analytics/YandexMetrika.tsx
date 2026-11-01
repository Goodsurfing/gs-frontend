"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";

declare global {
    interface Window {
        ym?: (id: number, method: string, ...args: unknown[]) => void;
    }
}

/** Счётчик старого фронта (index.html в корне); задаётся только для прода. */
const COUNTER_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) || 0;

/** Просмотр при переходах внутри приложения (первый засчитывает init). */
function PageHits() {
    const pathname = usePathname();
    const search = useSearchParams().toString();
    const previous = useRef<string | null>(null);

    useEffect(() => {
        const url = window.location.href;
        if (previous.current !== null && previous.current !== url) {
            window.ym?.(COUNTER_ID, "hit", url, { referer: previous.current });
        }
        previous.current = url;
    }, [pathname, search]);

    return null;
}

/**
 * Яндекс.Метрика с теми же настройками, что в старом фронте (вебвизор, карта
 * кликов, ecommerce). Без NEXT_PUBLIC_YANDEX_METRIKA_ID ничего не грузится —
 * стенды и локальная разработка не портят статистику прода.
 */
export function YandexMetrika() {
    if (!COUNTER_ID) return null;

    return (
        <>
            <Script id="yandex-metrika" strategy="afterInteractive">
                {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
ym(${COUNTER_ID},'init',{webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}
            </Script>
            <noscript>
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- пиксель Метрики без JS */}
                    <img src={`https://mc.yandex.ru/watch/${COUNTER_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
                </div>
            </noscript>
            <Suspense fallback={null}>
                <PageHits />
            </Suspense>
        </>
    );
}

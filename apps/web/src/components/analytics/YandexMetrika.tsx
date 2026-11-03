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

/**
 * Цели воронки — те же идентификаторы, что у старого фронта
 * (src/shared/lib/analytics/trackGoal.ts) и в кабинете Метрики.
 */
export type MetrikaGoal =
    | "signup"
    | "email_confirmed"
    | "vacancy_view"
    | "application_sent"
    | "application_accepted"
    | "application_rejected"
    | "checkout_start"
    | "membership_paid"
    | "donation_start"
    | "donation_paid"
    | "vacancy_published";

/**
 * Вызовы до того, как выполнился скрипт счётчика. Он подключается после
 * гидратации (afterInteractive), а цели «при открытии страницы»
 * (vacancy_view, donation_paid, email_confirmed) отправляются из useEffect
 * раньше — без очереди при прямом заходе они терялись. Скрипт сам создаёт
 * очередь window.ym сразу после init, туда их и переносим (flushPendingGoals).
 */
const pending: unknown[][] = [];

function send(...args: unknown[]) {
    if (window.ym) window.ym(COUNTER_ID, ...(args as [string, ...unknown[]]));
    else pending.push(args);
}

/** Отправить накопленные цели, когда счётчик появился (порядок: init, затем цели) */
export function flushPendingGoals() {
    if (!window.ym) return false;
    while (pending.length) {
        const args = pending.shift() as [string, ...unknown[]];
        try {
            window.ym(COUNTER_ID, ...args);
        } catch {
            // Аналитика не должна ломать интерфейс
        }
    }
    return true;
}

/** Цель Метрики (reachGoal старого фронта); без счётчика — ничего, ошибки аналитики не ломают страницу */
export function reachGoal(goal: MetrikaGoal, params?: Record<string, unknown>) {
    if (!COUNTER_ID) return;
    try {
        send("reachGoal", goal, params);
    } catch {
        // Аналитика не должна ломать интерфейс
    }
}

/**
 * Цель, затем переход со страницы: без ожидания запрос Метрики обрывается
 * при уходе. Ждём ответа счётчика, но не дольше секунды; без счётчика —
 * сразу дальше.
 */
export function reachGoalThen(goal: MetrikaGoal, params: Record<string, unknown> | undefined, next: () => void) {
    if (!COUNTER_ID || !window.ym) {
        next();
        return;
    }
    let done = false;
    const leave = () => {
        if (done) return;
        done = true;
        next();
    };
    window.setTimeout(leave, 1000);
    try {
        window.ym(COUNTER_ID, "reachGoal", goal, params, leave);
    } catch {
        leave();
    }
}

/**
 * Цель один раз на ключ за сессию браузера (trackGoalOnce старого фронта) —
 * для страниц успеха, которые можно обновить или открыть по ссылке ещё раз.
 */
export function reachGoalOnce(goal: MetrikaGoal, key: string, params?: Record<string, unknown>) {
    const storageKey = `gs_goal_${goal}_${key}`;
    try {
        if (window.sessionStorage.getItem(storageKey)) return;
        window.sessionStorage.setItem(storageKey, "1");
    } catch {
        // Без sessionStorage — просто отправляем
    }
    reachGoal(goal, params);
}

/** Цель при открытии страницы — для серверных страниц успеха */
export function GoalOnce({ goal, goalKey }: { goal: MetrikaGoal; goalKey: string }) {
    useEffect(() => {
        reachGoalOnce(goal, goalKey);
    }, [goal, goalKey]);
    return null;
}

/** Ждёт скрипт счётчика (до 15 с) и отправляет цели, накопленные до него */
function FlushPendingGoals() {
    useEffect(() => {
        if (flushPendingGoals()) return;
        const started = Date.now();
        const timer = window.setInterval(() => {
            if (flushPendingGoals() || Date.now() - started > 15_000) window.clearInterval(timer);
        }, 100);
        return () => window.clearInterval(timer);
    }, []);
    return null;
}

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
                    <img loading="eager" src={`https://mc.yandex.ru/watch/${COUNTER_ID}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
                </div>
            </noscript>
            <FlushPendingGoals />
            <Suspense fallback={null}>
                <PageHits />
            </Suspense>
        </>
    );
}

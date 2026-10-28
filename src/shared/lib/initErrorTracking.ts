import * as Sentry from "@sentry/react";

import { browserFamily, isPageTranslatedByBrowser } from "./domTranslationGuard";

// Сбор ошибок фронта в Bugsink (monitoring.goodsurfing.org, совместим с Sentry SDK).
// DSN задаётся при сборке (VITE_SENTRY_DSN); без него — ничего не отправляем
// (локальная разработка, тесты, стенды без мониторинга).
/**
 * Ошибка целиком внутри кода, который браузер внедрил при переводе страницы
 * (Safari: RangeError в функциях со строк, которых нет в нашем index.html):
 * в стеке нет ни одного нашего файла из /assets/. Исправить её мы не можем.
 */
export const isForeignTranslatorError = (
    event: Sentry.ErrorEvent,
    translated: boolean,
): boolean => {
    if (!translated) return false;
    const frames = (event.exception?.values ?? [])
        .flatMap((value) => value.stacktrace?.frames ?? []);
    return frames.length > 0 && !frames.some((frame) => (frame.filename ?? "").includes("/assets/"));
};

export const initErrorTracking = () => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) return;

    Sentry.init({
        dsn,
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "prod",
        // Тег релиза (v*.*.* на проде, develop-<sha> на стейдже) — чтобы закрывать
        // задачи в Bugsink «исправлено в следующем релизе»
        release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
        // Без данных пользователя, cookies, заголовков, тел и параметров запросов —
        // в событиях не должно быть ПДн
        dataCollection: {
            userInfo: false,
            cookies: false,
            httpHeaders: false,
            httpBodies: [],
            urlQueryParams: false,
        },
        // Только ошибки, без трассировки производительности
        tracesSampleRate: 0,
        ignoreErrors: [
            // Шум браузера и расширений, к нашему коду отношения не имеет
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications",
            "Non-Error promise rejection captured",
            // Не догрузился скрипт входа через VK ID у пользователя — сеть/блокировщик
            /Failed to fetch \(id\.vk\.ru\)/,
            // Не загрузился внешний <script> (чаще всего API Яндекс.Карт: сеть,
            // блокировщик). Загрузчик отклоняет promise DOM-событием, а не
            // ошибкой; пользователю карта и так показывает заглушку по тайм-ауту.
            /Event `Event` \(type=error\) captured as promise rejection/,
        ],
        // Метки без ПДн: переведена ли страница браузером и каким браузером —
        // чтобы отличать ошибки переводчиков (removeChild и т.п.) от наших.
        beforeSend(event) {
            const translated = isPageTranslatedByBrowser();
            if (isForeignTranslatorError(event, translated)) {
                return null;
            }
            event.tags = {
                ...event.tags,
                page_translated: String(translated),
                browser_family: browserFamily(),
            };
            return event;
        },
        denyUrls: [
            /^chrome-extension:\/\//,
            /^moz-extension:\/\//,
            /mc\.yandex\.ru/,
            // Внутренние ошибки JS API Яндекс.Карт (например, «map.action.Continuous:
            // ticking while inactive» в Mobile Safari при зуме) — не наш код, исправить их нельзя
            /yastatic\.net\/s3\/front-maps-static\//,
        ],
    });
};

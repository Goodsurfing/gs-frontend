import * as Sentry from "@sentry/react";

// Сбор ошибок фронта в Bugsink (monitoring.goodsurfing.org, совместим с Sentry SDK).
// DSN задаётся при сборке (VITE_SENTRY_DSN); без него — ничего не отправляем
// (локальная разработка, тесты, стенды без мониторинга).
export const initErrorTracking = () => {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) return;

    Sentry.init({
        dsn,
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || "prod",
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
        ],
        denyUrls: [/^chrome-extension:\/\//, /^moz-extension:\/\//, /mc\.yandex\.ru/],
    });
};

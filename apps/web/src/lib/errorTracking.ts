/**
 * Общие настройки сбора ошибок в Bugsink (monitoring.goodsurfing.org,
 * совместим с Sentry SDK) для сервера и браузера — те же правила, что у
 * старого фронта (src/shared/lib/initErrorTracking.ts в корне): без ПДн,
 * без трассировки, без шума браузеров и расширений.
 *
 * DSN задаётся при сборке (NEXT_PUBLIC_SENTRY_DSN); без него ничего не
 * отправляется — локальная разработка, тесты.
 */
export const errorTrackingOptions = () => ({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
    enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "prod",
    // web-<тег> на проде, web-develop-<sha> на стейдже: отличать от старого SPA
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
    initialScope: { tags: { app: "web" } },
    // SENTRY_DEBUG=1 — подробный журнал SDK (почему событие не ушло и т. п.)
    debug: process.env.SENTRY_DEBUG === "1",
    // Без данных пользователя, cookies, заголовков, тел и параметров запросов
    dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [] as never[],
        urlQueryParams: false,
    },
    tracesSampleRate: 0,
    ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "ResizeObserver loop completed with undelivered notifications",
        "Non-Error promise rejection captured",
        // Сканеры шлют POST на / и /api с мусорными заголовками Next (Next-Router-State-Tree,
        // RSC) — Next отвечает ошибкой, пользователей это не касается (05.11.2026)
        "The router state header was sent but could not be parsed",
        "Expected RSC response, got text/plain",
        // API недоступен (перезапуск бэкенда при выкатке, ~1 мин): страница уже отдана
        // из кэша или с экраном ошибки, сбой видит бот статуса. В Bugsink это давало
        // по 150 событий на каждую выкатку бэкенда (ApiUnavailableError, lib/apiUnavailable.ts)
        "API недоступен",
    ],
});

export const DENY_URLS = [/^chrome-extension:\/\//, /^moz-extension:\/\//, /mc\.yandex\.ru/];

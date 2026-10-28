// Только нужное из @sentry/browser: импорт через этот модуль даёт сборщику
// выкинуть остальное (import("@sentry/browser") тянул SDK целиком, ~400 КБ)
export {
    browserApiErrorsIntegration,
    captureException,
    dedupeIntegration,
    eventFiltersIntegration,
    functionToStringIntegration,
    globalHandlersIntegration,
    httpContextIntegration,
    init,
    linkedErrorsIntegration,
} from "@sentry/browser";

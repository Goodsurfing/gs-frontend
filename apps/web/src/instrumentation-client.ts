import { DENY_URLS, errorTrackingOptions } from "@/lib/errorTracking";

/**
 * Ошибки в браузере — в Bugsink. SDK (@sentry/browser с нужными интеграциями)
 * грузится отдельным чанком после загрузки страницы: @sentry/nextjs целиком
 * добавлял к странице ~335 КБ JS. Ошибки, случившиеся до загрузки SDK,
 * копятся и отправляются сразу после инициализации.
 */
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const early: unknown[] = [];
    const onError = (event: ErrorEvent) => early.push(event.error ?? event.message);
    const onRejection = (event: PromiseRejectionEvent) => early.push(event.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    const start = async () => {
        const Sentry = await import("@/lib/sentryBrowser");
        Sentry.init({
            ...errorTrackingOptions(),
            denyUrls: DENY_URLS,
            defaultIntegrations: false,
            integrations: [
                Sentry.eventFiltersIntegration(),
                Sentry.functionToStringIntegration(),
                Sentry.browserApiErrorsIntegration(),
                Sentry.globalHandlersIntegration(),
                Sentry.linkedErrorsIntegration(),
                Sentry.dedupeIntegration(),
                Sentry.httpContextIntegration(),
            ],
        });
        window.removeEventListener("error", onError);
        window.removeEventListener("unhandledrejection", onRejection);
        for (const error of early) Sentry.captureException(error);
    };

    if (document.readyState === "complete") void start();
    else window.addEventListener("load", () => void start(), { once: true });
}

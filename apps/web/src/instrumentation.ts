import * as Sentry from "@sentry/nextjs";

import { errorTrackingOptions } from "@/lib/errorTracking";

/** Ошибки серверного рендера и обработчиков маршрутов — в Bugsink. */
export function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        Sentry.init(errorTrackingOptions());
    }
}

export const onRequestError = Sentry.captureRequestError;

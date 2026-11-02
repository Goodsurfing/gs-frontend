"use client";

import { useEffect, useState } from "react";

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { isChunkLoadError, reloadOnceForChunkError } from "@/lib/chunkReload";

// Тексты из public/locales/*/translation.json («Что-то пошло не так», «Обновить страницу»):
// граница ошибки — клиентская и рисуется, когда серверные словари недоступны
const TEXTS: Record<Locale, { text: string; button: string }> = {
    ru: { text: "Что-то пошло не так. Попробуйте обновить страницу.", button: "Обновить страницу" },
    en: { text: "Something went wrong. Please refresh the page.", button: "Refresh the page" },
    es: { text: "Algo salió mal. Intenta actualizar la página.", button: "Actualizar la página" },
};

const localeFromPath = (): Locale => {
    const first = window.location.pathname.split("/")[1] ?? "";
    return isLocale(first) ? first : DEFAULT_LOCALE;
};

/**
 * Экран ошибки (AppErrorBoundary старого фронта): вместо белого экрана —
 * текст и кнопка обновления, ошибка уходит в Bugsink. Не догрузился чанк
 * (вкладка открыта до выкатки) — один раз перезагружаем страницу, без
 * экрана ошибки и без события в Bugsink.
 */
export function ErrorScreen({ error }: { error: Error & { digest?: string } }) {
    // На сервере (window нет) и без хранилища браузера — без перезагрузки, просто экран ошибки
    const [reloading] = useState(() => {
        if (typeof window === "undefined" || !isChunkLoadError(error)) return false;
        try {
            return reloadOnceForChunkError();
        } catch {
            return false;
        }
    });
    const [locale] = useState<Locale>(() => (typeof window === "undefined" ? DEFAULT_LOCALE : localeFromPath()));

    useEffect(() => {
        if (reloading) return;
        void import("@/lib/sentryBrowser").then((Sentry) => Sentry.captureException(error)).catch(() => undefined);
    }, [error, reloading]);

    if (reloading) return null;
    const texts = TEXTS[locale];
    return (
        <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-[18px] leading-[140%]">{texts.text}</p>
            <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer rounded-[10px] border-0 bg-primary px-6 py-3 text-[16px] text-white"
            >
                {texts.button}
            </button>
        </div>
    );
}

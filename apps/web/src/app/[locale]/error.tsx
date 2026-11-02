"use client";

import { ErrorScreen } from "@/components/errors/ErrorScreen";

/** Ошибка рендера страницы раздела: шапка и подвал остаются, вместо содержимого — экран ошибки */
export default function LocaleError({ error }: { error: Error & { digest?: string } }) {
    return <ErrorScreen error={error} />;
}

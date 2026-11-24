import { notFound } from "next/navigation";
import { Suspense } from "react";

import { SilentBoundary } from "./SilentBoundary";

/** Бросает notFound() во время отрисовки — внутри Suspense, см. NotFoundStatus */
async function ThrowNotFound(): Promise<never> {
    notFound();
}

/**
 * Настоящий HTTP 404 для страницы с данными, которых нет (вакансия, организация, статья…), без
 * замены самой страницы: сообщение «не найдено» и каркас (шапка, подвал) остаются как есть.
 *
 * Почему не notFound() прямо в странице: в Next 16 он отдаёт пустую оболочку (`__next_error__`)
 * и дорисовывает 404 только в браузере, а not-found.tsx раздела вкладывается в данные каждой
 * страницы (apps/web/CLAUDE.md, «404»). notFound() внутри Suspense Next разрешает: прерисовка
 * (ISR) доводится до конца, всё вне границы остаётся в HTML, а код ответа становится 404 — и так
 * же кэшируется. В браузере граница пустая, а ошибку из неё глушит SilentBoundary — иначе её
 * поймал бы корневой обработчик 404 и заменил страницу.
 *
 * Ставить только на ответ API 4xx («не найдено»). Сбой API — это ApiUnavailableError, не 404:
 * иначе при выкатке бэкенда страницы выпадали бы из индекса.
 */
export function NotFoundStatus() {
    return (
        <SilentBoundary>
            <Suspense fallback={null}>
                <ThrowNotFound />
            </Suspense>
        </SilentBoundary>
    );
}

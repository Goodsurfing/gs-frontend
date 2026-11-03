/**
 * Ссылка из письма «Как всё прошло?» (gs-backend app:emails:review-requests):
 * звезда в письме ведёт на страницу «Отзывы» кабинета с параметрами —
 * волонтёру `?vacancy=ID&rating=N`, организатору `?volunteer=ID&vacancy=ID&rating=N`.
 * Страница открывает окно отзыва на этом проекте/волонтёре с уже
 * поставленной оценкой.
 */
export interface ReviewLink {
    vacancyId: number;
    volunteerId: string | null;
    rating: number | null;
}

export function parseReviewLink(search: string): ReviewLink | null {
    const params = new URLSearchParams(search);
    const vacancyId = Number(params.get("vacancy"));
    if (!Number.isInteger(vacancyId) || vacancyId <= 0) return null;
    const rating = Number(params.get("rating"));
    return {
        vacancyId,
        volunteerId: params.get("volunteer") || null,
        rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null,
    };
}

/** Убрать параметры ссылки из адреса, чтобы окно не открылось снова после обновления страницы */
export function clearReviewLink(): void {
    const url = new URL(window.location.href);
    for (const key of ["vacancy", "volunteer", "rating"]) url.searchParams.delete(key);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

/** Ссылка «Оценить» из плашки в кабинете — тот же формат, что у письма, без оценки */
export function reviewLinkHref(base: string, item: { side: "volunteer" | "host"; vacancyId: number; volunteerId: string }): string {
    const params = new URLSearchParams(item.side === "host" ? { volunteer: item.volunteerId, vacancy: String(item.vacancyId) } : { vacancy: String(item.vacancyId) });
    return `${base}?${params.toString()}`;
}

/** Плашку «Оцените» можно скрыть на 30 дней */
export const REMINDER_HIDE_DAYS = 30;

export function isReminderHidden(hiddenAt: string | null, now: number): boolean {
    const at = Number(hiddenAt);
    return Number.isFinite(at) && at > 0 && now - at < REMINDER_HIDE_DAYS * 24 * 60 * 60 * 1000;
}

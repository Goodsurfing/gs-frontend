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

/**
 * Один раз, когда список «без отзыва» загрузился: найти в нём цель ссылки
 * из письма и открыть окно отзыва с оценкой. Параметры из адреса убираются.
 */
export function openReviewFromLink<T>(
    items: T[],
    match: (item: T, link: ReviewLink) => boolean,
    open: (item: T, rating: number | null) => void,
): void {
    const link = parseReviewLink(window.location.search);
    if (!link) return;
    clearReviewLink();
    const target = items.find((item) => match(item, link));
    if (target) open(target, link.rating);
}

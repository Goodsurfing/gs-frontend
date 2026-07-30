// Пока не привязано к конкретному лимиту на бэкенде (в отличие от отзывов,
// где FeaturedHandler::MAX_RESULTS=10) — OffersSlider на главной сам
// ограничивает показ первыми 10 через slice(0, 10), см. GS-86.
export const MAX_FEATURED_OFFERS = 10;

export interface FeaturableOfferRow {
    id: string;
    isFeatured: boolean;
}

/**
 * Включение вакансии блокируем только когда лимит уже исчерпан — выключение
 * уже показанной на главной вакансии должно работать всегда, иначе admin
 * не сможет освободить место под другую.
 */
export const isFeaturedCapReached = (
    currentFeaturedTotal: number,
    nextValue: boolean,
): boolean => nextValue && currentFeaturedTotal >= MAX_FEATURED_OFFERS;

export const SLIDER_OFFERS_LIMIT = 10;

interface OfferLike {
    id: number;
}

/**
 * GS-86: пока admin не выбрал ни одной вакансии на главную, показываем
 * прежнюю алгоритмическую сортировку по рекомендациям — иначе блок
 * "Интересные вакансии" на главной окажется пустым.
 */
export const pickSliderOffers = <T extends OfferLike>(
    featured: T[],
    recommended: T[],
): T[] => (featured.length > 0 ? featured : recommended).slice(0, SLIDER_OFFERS_LIMIT);

export const SLIDER_OFFERS_LIMIT = 10;

interface OfferLike {
    id: number;
}

/**
 * Источники перечисляются в порядке приоритета: первый непустой побеждает.
 * GS-90: персональные вакансии по избранным категориям волонтёра важнее
 * admin-подборки. GS-86: пока admin не выбрал ни одной вакансии на
 * главную, показываем прежнюю алгоритмическую сортировку по
 * рекомендациям — иначе блок "Интересные вакансии" окажется пустым.
 */
export const pickSliderOffers = <T extends OfferLike>(
    ...sources: T[][]
): T[] => (sources.find((source) => source.length > 0) ?? []).slice(0, SLIDER_OFFERS_LIMIT);

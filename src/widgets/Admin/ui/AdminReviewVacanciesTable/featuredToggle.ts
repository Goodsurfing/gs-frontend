// Совпадает с App\Module\ReviewVacancy\Api\Query\Featured\FeaturedHandler::MAX_RESULTS
export const MAX_FEATURED_REVIEWS = 10;

export interface FeaturableReviewRow {
    id: string;
    rating: number;
    description: string;
    isFeatured: boolean;
}

/**
 * Включение отзыва блокируем только когда лимит уже исчерпан — выключение
 * уже показанного на главной отзыва должно работать всегда, иначе admin
 * не сможет освободить место под другой отзыв.
 */
export const isFeaturedCapReached = (
    currentFeaturedTotal: number,
    nextValue: boolean,
): boolean => nextValue && currentFeaturedTotal >= MAX_FEATURED_REVIEWS;

export const buildFeaturedEditBody = (row: FeaturableReviewRow, nextValue: boolean) => ({
    rating: row.rating,
    description: row.description,
    isFeatured: nextValue,
});

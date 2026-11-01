import type { components } from "@goodsurfing/api";

/** Участник или автор отзыва на странице вакансии */
export interface OfferPerson {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    image?: components["schemas"]["ImageResultDto"] | null;
}

export interface OfferReview {
    id: string;
    description: string;
    rating: number;
    createdAt?: string | null;
    images: components["schemas"]["ImageResultDto"][];
    author: OfferPerson;
}

export interface Page<T> {
    items: T[];
    total: number;
}

/** Отзыв из API в вид для страницы (рейтинг приходит числом без типа) */
export function toReviewClient(review: components["schemas"]["ListByVacancyResult"]): OfferReview {
    return {
        id: review.id,
        description: review.description,
        rating: Number(review.rating) || 0,
        createdAt: review.createdAt,
        images: review.images ?? [],
        author: review.author as OfferPerson,
    };
}

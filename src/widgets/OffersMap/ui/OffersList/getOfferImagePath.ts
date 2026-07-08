import { Image } from "@/types/media";

/**
 * Картинка карточки вакансии в списке /offers-map: у старых вакансий (легаси)
 * нет thumbnails, только contentUrl оригинала — используем его как fallback.
 * Регресс-фикс PR gs-frontend#337/#338 (коммит c2ce9312).
 */
export function getOfferImagePath(image?: Image | null): string | undefined {
    return image?.thumbnails?.medium ?? image?.contentUrl;
}

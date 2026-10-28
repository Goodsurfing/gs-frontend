import cn from "classnames";
import React, { FC, memo } from "react";

import { OfferApi, OfferCard as OfferCardComponent, useFavoriteOffers } from "@/entities/Offer";

import { useCategories } from "@/shared/data/categories";

import { Locale } from "@/entities/Locale";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./OfferCard.module.scss";

type OfferData = Pick<OfferApi, "id"> &
Partial<
Omit<
Pick<
OfferApi,
| "title"
| "shortDescription"
| "averageRating"
| "acceptedApplicationsCount"
| "address"
| "reviewsCount"
>,
"imagePath"
> & {
    imagePath?: string;
    categories: string[];
}
>;

interface OfferCardProps {
    data: OfferData;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string;
    isSelected?: boolean;
    onSelect?: (offerId: number) => void;
    hasLocation?: boolean;
    locale: Locale;
}

export const OfferCard: FC<OfferCardProps> = memo((props: OfferCardProps) => {
    const {
        data: {
            id,
            acceptedApplicationsCount, averageRating,
            imagePath, title, shortDescription,
            categories, address, reviewsCount,
        },
        status,
        className,
        classNameCard,
        isSelected,
        onSelect,
        hasLocation,
        locale,
    } = props;

    const { getTranslation } = useCategories();
    // Сердечко — только вошедшим (избранное хранится на сервере, gs-backend #407).
    const { enabled: isFavoriteEnabled, isFavorite, toggleFavorite } = useFavoriteOffers();

    return (
        <div
            className={cn(styles.wrapper, className, {
                [styles.closed]: status === "closed",
            })}
        >
            <OfferCardComponent
                offerId={id}
                title={title}
                description={shortDescription}
                category={getTranslation(categories?.[0])}
                image={imagePath}
                location={address}
                rating={averageRating}
                reviews={reviewsCount}
                went={acceptedApplicationsCount}
                link={getOfferPersonalPageUrl(locale, id.toString())}
                className={classNameCard}
                isFavoriteIconShow={isFavoriteEnabled}
                isFavorite={isFavorite(id)}
                isSelected={isSelected}
                onSelect={onSelect}
                hasLocation={hasLocation}
                locale={locale}
                handleFavoriteClick={toggleFavorite}
            />
        </div>
    );
});

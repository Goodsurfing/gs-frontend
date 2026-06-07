import cn from "classnames";
import React, { FC, memo, useState } from "react";

import { OfferCard as OfferCardComponent } from "@/entities/Offer";

import { useCategories } from "@/shared/data/categories";
import { getOfferBadge } from "@/shared/lib/formatDuration";

import { Locale } from "@/entities/Locale";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./OfferCard.module.scss";

export interface OfferCardData {
    id: number;
    title?: string;
    shortDescription?: string;
    imagePath?: string;
    categories?: string[];
    categoryColor?: string;
    address?: string;
    averageRating?: number;
    reviewsCount?: number;
    acceptedApplicationsCount?: number;
    durationMinDays?: number;
    durationMaxDays?: number;
    updated?: string;
    applicationEndDate?: string;
}

interface OfferCardProps {
    data: OfferCardData;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string;
    locale: Locale;
}

export const OfferCard: FC<OfferCardProps> = memo((props: OfferCardProps) => {
    const {
        data: {
            id,
            acceptedApplicationsCount,
            averageRating,
            imagePath,
            title,
            shortDescription,
            categories,
            categoryColor,
            address,
            reviewsCount,
            durationMinDays,
            durationMaxDays,
            updated,
            applicationEndDate,
        },
        status,
        className,
        classNameCard,
        locale,
    } = props;

    const { getTranslation } = useCategories();
    const [isFavorite, setFavorite] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onFavoriteClick = (_offerId: number) => {
        setFavorite((prev) => !prev);
    };

    const primaryCategory = getTranslation(categories?.[0]);

    const badge = updated
        ? getOfferBadge(updated, averageRating ?? 0, reviewsCount ?? 0, applicationEndDate)
        : null;

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
                category={primaryCategory}
                categoryColor={categoryColor}
                tags={categories
                    ?.map((c) => getTranslation(c) ?? c)
                    .filter((t): t is string => Boolean(t))}
                image={imagePath}
                location={address}
                rating={averageRating}
                reviews={reviewsCount}
                went={acceptedApplicationsCount}
                durationMinDays={durationMinDays}
                durationMaxDays={durationMaxDays}
                badge={badge}
                link={getOfferPersonalPageUrl(locale, id.toString())}
                className={classNameCard}
                isFavoriteIconShow={false}
                isFavorite={isFavorite}
                locale={locale}
                handleFavoriteClick={onFavoriteClick}
            />
        </div>
    );
});

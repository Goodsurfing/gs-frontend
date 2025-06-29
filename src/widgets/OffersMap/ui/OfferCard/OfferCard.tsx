import cn from "classnames";
import React, { FC, useState } from "react";

import { Offer, OfferCard as OfferCardComponent } from "@/entities/Offer";

import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";

import styles from "./OfferCard.module.scss";
import { Locale } from "@/entities/Locale";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferCardProps {
    data: Offer;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string;
    // isFavoriteIconShow: boolean;
    locale: Locale;
}

export const OfferCard: FC<OfferCardProps> = (props) => {
    const {
        data: {
            id, description, where,
            acceptedApplicationsCount, feedbacksCountinteger, averageRating,
        },
        status,
        className,
        classNameCard,
        locale,
    } = props;
    const imageCover = getMediaContent(description?.image);
    const { getTranslation } = useCategories();
    const [isFavorite, setFavorite] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onFavoriteClick = (offerId: number) => {
        setFavorite((prev) => !prev);
    };

    return (
        <div
            className={cn(styles.wrapper, className, {
                [styles.closed]: status === "closed",
            })}
        >
            <OfferCardComponent
                offerId={id}
                title={description?.title}
                description={description?.shortDescription}
                category={getTranslation(description?.categoryIds[0])}
                image={imageCover}
                location={where?.address || ""}
                rating={averageRating?.toString()}
                reviews={feedbacksCountinteger?.toString()}
                went={acceptedApplicationsCount.toString()}
                link={getOfferPersonalPageUrl(locale, id.toString())}
                className={classNameCard}
                isFavoriteIconShow={false}
                isFavorite={isFavorite}
                locale={locale}
                handleFavoriteClick={onFavoriteClick}
            />
        </div>
    );
};

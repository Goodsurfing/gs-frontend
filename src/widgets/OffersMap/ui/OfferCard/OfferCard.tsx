import cn from "classnames";
import React, { FC, memo, useState } from "react";

import { HostOffer, OfferApi, OfferCard as OfferCardComponent } from "@/entities/Offer";

import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";

import styles from "./OfferCard.module.scss";
import { Locale } from "@/entities/Locale";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferCardProps {
    data: HostOffer | OfferApi;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string;
    // isFavoriteIconShow: boolean;
    locale: Locale;
}

export const OfferCard: FC<OfferCardProps> = memo((props: OfferCardProps) => {
    const {
        data: {
            id,
            acceptedApplicationsCount, averageRating,
            description,
            categories, address, reviewsCount, image,
        },
        status,
        className,
        classNameCard,
        locale,
    } = props;

    const imageCover = getMediaContent(image, "MEDIUM");
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
                title={title}
                description={shortDescription}
                category={getTranslation(categories[0])}
                image={imageCover}
                location={address}
                rating={averageRating}
                reviews={reviewsCount}
                went={Number(acceptedApplicationsCount)}
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

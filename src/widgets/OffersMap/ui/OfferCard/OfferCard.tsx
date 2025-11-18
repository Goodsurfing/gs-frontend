import cn from "classnames";
import React, { FC, memo, useState } from "react";

import { OfferApi, OfferCard as OfferCardComponent } from "@/entities/Offer";

import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";

import styles from "./OfferCard.module.scss";
import { Locale } from "@/entities/Locale";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { MediaObjectType } from "@/types/media";

type OfferData = Pick<OfferApi, "id"> &
Partial<
Omit<
Pick<
OfferApi,
| "title"
| "shortDescription"
| "imagePath"
| "categories"
| "averageRating"
| "acceptedApplicationsCount"
| "address"
| "reviewsCount"
>,
"imagePath"
> & {
    imagePath?: string | MediaObjectType;
}
>;

interface OfferCardProps {
    data: OfferData;
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
            imagePath, title, shortDescription,
            categories, address, reviewsCount,
        },
        status,
        className,
        classNameCard,
        locale,
    } = props;

    const imageCover = getMediaContent(imagePath, "SMALL");
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
                category={getTranslation(categories?.[0])}
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

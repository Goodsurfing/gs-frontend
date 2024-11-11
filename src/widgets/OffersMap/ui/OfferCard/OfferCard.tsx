import cn from "classnames";
import React, { FC, useState } from "react";

import { Offer, OfferCard as OfferCardComponent } from "@/entities/Offer";

import { useCategories } from "@/shared/data/categories";
import { getMediaContent } from "@/shared/lib/getMediaContent";

import styles from "./OfferCard.module.scss";
import { Locale } from "@/entities/Locale";

interface OfferCardProps {
    data: Offer;
    status: "opened" | "closed";
    className?: string;
    classNameCard?: string;
    isFavoriteIconShow: boolean;
    locale: Locale;
}

export const OfferCard: FC<OfferCardProps> = (props) => {
    const {
        data: { id, description, where },
        status,
        className,
        classNameCard,
        isFavoriteIconShow,
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
                likes="5"
                rating="10"
                reviews="8"
                went="21"
                link={`offer-personal/${id}`}
                className={classNameCard}
                isFavoriteIconShow={isFavoriteIconShow}
                isFavorite={isFavorite}
                locale={locale}
                handleFavoriteClick={onFavoriteClick}
            />
        </div>
    );
};

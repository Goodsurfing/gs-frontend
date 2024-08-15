import React, { FC, memo } from "react";
import cn from "classnames";

import styles from "./OfferGalleryCard.module.scss";
import { useGetOfferGalleryItemsQuery } from "../../api/offerApi";
import { OfferGalleryItem } from "../../model/types/offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OfferGalleryCardProps {
    offerId: number;
    className?: string;
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo(
    (props: OfferGalleryCardProps) => {
        const { offerId, className } = props;
        const { data: gallery } = useGetOfferGalleryItemsQuery(offerId.toString());

        const renderGallery = (allImages?: OfferGalleryItem[]) => {
            if (!allImages) return (<p>Галерея не заполнена</p>);
            return (allImages.map(
                (image) => (
                    <img
                        src={getMediaContent(image.mediaObject.contentUrl)}
                        key={image.id}
                        alt={image.mediaObject.contentUrl}
                        className={styles.image}
                    />
                ),
            ));
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Фотографии</h3>
                <div className={styles.container}>{renderGallery(gallery)}</div>
            </div>
        );
    },
);

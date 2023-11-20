import React, { FC, memo } from "react";
import cn from "classnames";

import classNames from "classnames";
import styles from "./OfferGalleryCard.module.scss";

interface OfferGalleryCardProps {
    gallery: string[];
    className?: string;
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo(
    (props: OfferGalleryCardProps) => {
        const { gallery, className } = props;

        const renderGallery = (allImages: string[]) => allImages.map(
            (image, index) => (
                <img src={image} key={index} alt={image} className={styles.image} />
            ),
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Фотографии</h3>
                <div className={styles.container}>{renderGallery(gallery)}</div>
            </div>
        );
    },
);

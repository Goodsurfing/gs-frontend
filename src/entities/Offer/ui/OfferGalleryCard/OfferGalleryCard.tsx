import React, { FC, memo } from "react";

import styles from "./OfferGalleryCard.module.scss";

interface OfferGalleryCardProps {
    gallery:string[]
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo((props: OfferGalleryCardProps) => {
    const { gallery } = props;

    const renderGallery = (allImages:string[]) => allImages.map(
        (image, index) => <img src={image} key={index} alt={image} />,
    );

    return (
        <div className={styles.wrapper}>
            <h3>Фотографии</h3>
            <div className={styles.container}>
                {renderGallery(gallery)}
            </div>
        </div>
    );
});

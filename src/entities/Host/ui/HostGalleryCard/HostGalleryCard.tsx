import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import styles from "./HostGalleryCard.module.scss";

interface HostGalleryCardProps {
    className?: string;
    images: string[];
}

const RENDER_TWELVE_CARDS = [0, 12];

export const HostGalleryCard: FC<HostGalleryCardProps> = memo(
    (props: HostGalleryCardProps) => {
        const { className, images } = props;

        const renderCards = useMemo(
            () => images
                .slice(...RENDER_TWELVE_CARDS)
                .map((image, index) => (
                    <img src={image} alt="gallery-img" className={styles.image} key={index} />
                )),
            [images],
        );

        return (
            <div className={cn(styles.wrapper, className)}>
                <h3>Добавленные фотографии</h3>
                <div className={styles.container}>{renderCards}</div>
            </div>
        );
    },
);

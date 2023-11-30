import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./HostGalleryCard.module.scss";
import { ImageGallery } from "@/widgets/ImageGallery";

interface HostGalleryCardProps {
    className?: string;
    images: string[];
}

export const HostGalleryCard: FC<HostGalleryCardProps> = memo(
    (props: HostGalleryCardProps) => {
        const { className, images } = props;

        return (
            <div className={cn(styles.wrapper, className)}>
                <h3>Добавленные фотографии</h3>
                <ImageGallery images={images} className={styles.container} />
            </div>
        );
    },
);

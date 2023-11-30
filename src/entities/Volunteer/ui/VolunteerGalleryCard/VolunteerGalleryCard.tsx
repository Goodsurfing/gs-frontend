import cn from "classnames";
import React, { FC, memo } from "react";

import { ImageGallery } from "@/widgets/ImageGallery";

import styles from "./VolunteerGalleryCard.module.scss";

interface VolunteerGalleryCardProps {
    className?: string;
    images?: string[];
}

export const VolunteerGalleryCard: FC<VolunteerGalleryCardProps> = memo(
    (props: VolunteerGalleryCardProps) => {
        const { className, images } = props;

        return (
            <div className={cn(styles.wrapper, className)}>
                <h3 className={styles.title}>Добавленные фотографии</h3>
                {images ? (
                    <ImageGallery
                        images={images}
                        className={styles.container}
                    />
                ) : (
                    <span>Здесь будут размещены фотографии волонтера.</span>
                )}
            </div>
        );
    },
);

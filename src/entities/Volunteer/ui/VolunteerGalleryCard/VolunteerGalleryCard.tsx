import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./VolunteerGalleryCard.module.scss";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";

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
                    <ImageGallerySlider images={images} />
                ) : (
                    <span>Здесь будут размещены фотографии волонтера.</span>
                )}
            </div>
        );
    },
);

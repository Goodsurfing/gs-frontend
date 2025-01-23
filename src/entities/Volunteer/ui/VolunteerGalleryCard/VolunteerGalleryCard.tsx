import cn from "classnames";
import React, { FC, memo } from "react";

import styles from "./VolunteerGalleryCard.module.scss";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Text } from "@/shared/ui/Text/Text";

interface VolunteerGalleryCardProps {
    className?: string;
    images?: string[];
}

export const VolunteerGalleryCard: FC<VolunteerGalleryCardProps> = memo(
    (props: VolunteerGalleryCardProps) => {
        const { className, images } = props;

        return (
            <div id="4" className={cn(styles.wrapper, className)}>
                <Text title="Добавленные фотографии" titleSize="h3" />
                {images ? (
                    <ImageGallerySlider images={images} />
                ) : (
                    <span>Здесь будут размещены фотографии волонтера.</span>
                )}
            </div>
        );
    },
);

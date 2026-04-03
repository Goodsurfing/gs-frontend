import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./VolunteerGalleryCard.module.scss";

interface VolunteerGalleryCardProps {
    className?: string;
    images?: string[];
}

export const VolunteerGalleryCard: FC<VolunteerGalleryCardProps> = memo(
    (props: VolunteerGalleryCardProps) => {
        const { className, images } = props;
        const { t } = useTranslation("profile");

        return (
            <div id="4" className={cn(styles.wrapper, className)}>
                <Text title={t("personal.Фото")} titleSize="h3" />
                {images ? (
                    <ImageGallerySlider images={images} />
                ) : (
                    <span>{t("personal.Здесь будут размещены фотографии волонтера.")}</span>
                )}
            </div>
        );
    },
);

import cn from "classnames";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";

import { Text } from "@/shared/ui/Text/Text";
import styles from "./HostGalleryCard.module.scss";

interface HostGalleryCardProps {
    className?: string;
    images: string[];
}

export const HostGalleryCard: FC<HostGalleryCardProps> = memo(
    (props: HostGalleryCardProps) => {
        const { className, images } = props;
        const { t } = useTranslation("host");

        const renderImageGallery = () => {
            if (images.length === 0) {
                return (
                    <p
                        className={styles.container}
                    >
                        {t("personalHost.Галерея не заполнена")}
                    </p>
                );
            }
            return (
                <ImageGallerySlider
                    images={images}
                    className={styles.container}
                />
            );
        };

        return (
            <div id="3" className={cn(styles.wrapper, className)}>
                <Text title={t("personalHost.Фото")} titleSize="h3" />
                {renderImageGallery()}
            </div>
        );
    },
);

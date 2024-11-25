import cn from "classnames";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";

import styles from "./HostGalleryCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface HostGalleryCardProps {
    className?: string;
    images: string[];
}

export const HostGalleryCard: FC<HostGalleryCardProps> = memo(
    (props: HostGalleryCardProps) => {
        const { className, images } = props;
        const { t } = useTranslation("host");

        return (
            <div className={cn(styles.wrapper, className)}>
                <Text title={t("personalHost.Фото")} titleSize="h3" />
                <ImageGallerySlider
                    images={images}
                    className={styles.container}
                />
            </div>
        );
    },
);

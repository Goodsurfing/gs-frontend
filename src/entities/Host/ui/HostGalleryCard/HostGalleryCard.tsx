import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./HostGalleryCard.module.scss";
import { ImageGallery } from "@/widgets/ImageGallery";

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
                <h3>{t("personalHost.Фото")}</h3>
                <ImageGallery images={images} className={styles.container} />
            </div>
        );
    },
);

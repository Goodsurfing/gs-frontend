import React, { FC, memo } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import styles from "./OfferGalleryCard.module.scss";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Text } from "@/shared/ui/Text/Text";
import { Image } from "@/types/media";
import { BASE_URL } from "@/shared/constants/api";

interface OfferGalleryCardProps {
    galleryImages?: Image[];
    className?: string;
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo(
    (props: OfferGalleryCardProps) => {
        const { galleryImages = [], className } = props;
        const { t } = useTranslation("offer");
        const formatGallery = galleryImages.map((image) => `${BASE_URL}${image.contentUrl.slice(1)}`);

        if (galleryImages.length === 0) {
            return null;
        }

        return (
            <div className={cn(className, styles.wrapper)} id="gallery">
                <Text title={t("personalOffer.Фотографии")} titleSize="h3" />
                <ImageGallerySlider images={formatGallery} className={styles.container} />
            </div>
        );
    },
);

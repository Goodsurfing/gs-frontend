import React, { FC, memo } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import styles from "./OfferGalleryCard.module.scss";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Text } from "@/shared/ui/Text/Text";
import { Image } from "@/types/media";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OfferGalleryCardProps {
    galleryImages?: Image[];
    className?: string;
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo(
    (props: OfferGalleryCardProps) => {
        const { galleryImages = [], className } = props;
        const { t } = useTranslation("offer");
        // "large"-thumbnail вместо оригинала — тут отдаётся ~1MB PNG на слайдер
        // шириной 264px, при том что бэкенд уже готовит webp-миниатюры.
        const formatGallery = galleryImages
            .map((image) => getMediaContent(image, "LARGE"))
            .filter((url): url is string => Boolean(url));

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

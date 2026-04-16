import React, { FC, memo } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Text } from "@/shared/ui/Text/Text";
import { Image } from "@/types/media";
import { getMediaContentsArray } from "@/shared/lib/getMediaContent";
import styles from "./DonationGalleryCard.module.scss";

interface DonationGalleryCardProps {
    galleryImages?: Image[];
    className?: string;
}

export const DonationGalleryCard: FC<DonationGalleryCardProps> = memo(
    (props: DonationGalleryCardProps) => {
        const { galleryImages = [], className } = props;
        const { t } = useTranslation("donation");
        const formatGallery = getMediaContentsArray(galleryImages);

        if (galleryImages.length === 0) {
            return (
                <div className={cn(className, styles.wrapper)} id="gallery">
                    <Text title={t("donationPersonal.Фотографии")} titleSize="h3" />
                    <p>{t("donationPersonal.Фотографии не были добавлены")}</p>
                </div>
            );
        }

        return (
            <div className={cn(className, styles.wrapper)} id="gallery">
                <Text title={t("donationPersonal.Фотографии")} titleSize="h3" />
                <ImageGallerySlider images={formatGallery} className={styles.container} />
            </div>
        );
    },
);

import React, { FC, memo } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import { useGetOfferGalleryItemsQuery } from "../../api/offerApi";
import styles from "./OfferGalleryCard.module.scss";
import { ImageGallerySlider } from "@/shared/ui/ImageGallerySlider/ImageGallerySlider";
import { Text } from "@/shared/ui/Text/Text";

interface OfferGalleryCardProps {
    offerId: number;
    className?: string;
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo(
    (props: OfferGalleryCardProps) => {
        const { offerId, className } = props;
        const { data: gallery } = useGetOfferGalleryItemsQuery(offerId.toString());
        const { t } = useTranslation("offer");

        if (!gallery) {
            return null;
        }

        return (
            <div className={cn(className, styles.wrapper)} id="gallery">
                <Text title={t("personalOffer.Фотографии")} titleSize="h3" />
                <ImageGallerySlider images={gallery} className={styles.container} />
            </div>
        );
    },
);

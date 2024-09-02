import React, { FC, memo, useState } from "react";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import { useGetOfferGalleryItemsQuery } from "../../api/offerApi";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ModalGallery } from "@/shared/ui/ModalGallery/ModalGallery";
import { GalleryItem } from "@/types/media";
import styles from "./OfferGalleryCard.module.scss";

interface OfferGalleryCardProps {
    offerId: number;
    className?: string;
}

export const OfferGalleryCard: FC<OfferGalleryCardProps> = memo(
    (props: OfferGalleryCardProps) => {
        const { offerId, className } = props;
        const { data: gallery } = useGetOfferGalleryItemsQuery(offerId.toString());
        const { t } = useTranslation("offer");
        const [isModalOpen, setModalOpen] = useState<boolean>(false);
        const [galleryItem, setGalleryItem] = useState<number>(0);

        const renderGallery = (allImages?: GalleryItem[]) => {
            if (!allImages) return (<p>Галерея не заполнена</p>);
            return (allImages.map(
                (image, index) => (
                    <img
                        src={getMediaContent(image.mediaObject.contentUrl)}
                        key={image.id}
                        alt={image.mediaObject.contentUrl}
                        className={styles.image}
                        onClick={() => {
                            setModalOpen(true);
                            setGalleryItem(index);
                        }}
                    />
                ),
            ));
        };

        const handleModalClose = () => {
            setModalOpen(false);
        };

        return (
            <div className={cn(className, styles.wrapper)} id="gallery">
                <h3>{t("personalOffer.Фотографии")}</h3>
                <div className={styles.container}>{renderGallery(gallery)}</div>
                <ModalGallery
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    images={gallery}
                    initialSlide={galleryItem}
                />
            </div>
        );
    },
);

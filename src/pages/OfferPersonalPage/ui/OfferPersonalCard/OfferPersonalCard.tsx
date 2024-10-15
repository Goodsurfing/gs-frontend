import { memo, useCallback, useState } from "react";

import { Offer } from "@/entities/Offer";
import { useGetOfferGalleryItemsQuery } from "@/entities/Offer/api/offerApi";
import { PersonalCard } from "@/entities/PersonalCard";

import {
    getMediaContent,
    getMediaContentsArray,
} from "@/shared/lib/getMediaContent";
import { ModalGallery } from "@/shared/ui/ModalGallery/ModalGallery";

import { OfferPersonalCardCategory } from "../OfferPersonalCardCategory/OfferPersonalCardCategory";
import { OfferPersonalCardImageBlock } from "../OfferPersonalCardImageBlock/OfferPersonalCardImageBlock";

interface OfferPersonalCardProps {
    id: string;
    offerData: Offer;
}

export const OfferPersonalCard = memo((props: OfferPersonalCardProps) => {
    const { id, offerData } = props;
    const { data: gallery } = useGetOfferGalleryItemsQuery(id.toString());
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const onImagesClick = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const showImageBlock = gallery?.length ? (
        <OfferPersonalCardImageBlock onImagesClick={onImagesClick} />
    ) : null;

    return (
        <>
            <PersonalCard
                offerId={id}
                image={getMediaContent(offerData.description?.image)}
                title={offerData.description?.title}
                location={offerData.where?.address}
                rating={4.3}
                categories={(
                    <OfferPersonalCardCategory
                        categories={offerData.description?.categoryIds}
                    />
                )}
                imageBlock={showImageBlock}
            />
            {gallery && (
                <ModalGallery
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    images={getMediaContentsArray(gallery)}
                />
            )}
        </>
    );
});

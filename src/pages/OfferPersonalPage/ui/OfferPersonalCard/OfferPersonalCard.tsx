import { memo, useCallback, useState } from "react";

import { Offer } from "@/entities/Offer";
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
    isVolunteer: boolean;
}

export const OfferPersonalCard = memo((props: OfferPersonalCardProps) => {
    const { id, offerData, isVolunteer } = props;
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const onImagesClick = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const showImageBlock = offerData.galleryImages.length > 0 ? (
        <OfferPersonalCardImageBlock
            onImagesClick={onImagesClick}
            images={getMediaContentsArray(offerData.galleryImages)}
        />
    ) : null;

    return (
        <>
            <PersonalCard
                offerId={id}
                image={getMediaContent(offerData.description?.image?.contentUrl)}
                title={offerData.description?.title}
                location={offerData.where?.address}
                reviewsCount={offerData.reviewsCount}
                rating={offerData.averageRating}
                categories={(
                    <OfferPersonalCardCategory
                        categories={offerData.description?.categories}
                    />
                )}
                imageBlock={showImageBlock}
                canEdit={offerData.canEdit}
                canParticipate={offerData.canParticipate}
                status={offerData.status}
                isVolunteer={isVolunteer}
            />
            {(offerData.galleryImages.length > 0) && (
                <ModalGallery
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    images={getMediaContentsArray(offerData.galleryImages)}
                />
            )}
        </>
    );
});

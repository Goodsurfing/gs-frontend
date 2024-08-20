import { memo, useCallback, useState } from "react";

import { PersonalCard } from "@/entities/PersonalCard";

import { OfferPersonalCardCategory } from "../OfferPersonalCardCategory/OfferPersonalCardCategory";
import { OfferPersonalCardImageBlock } from "../OfferPersonalCardImageBlock/OfferPersonalCardImageBlock";
import { useGetOfferByIdQuery } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetOfferGalleryItemsQuery } from "@/entities/Offer/api/offerApi";
import { ModalGallery } from "@/shared/ui/ModalGallery/ModalGallery";

interface OfferPersonalCardProps {
    id: string
}

export const OfferPersonalCard = memo((props: OfferPersonalCardProps) => {
    const { id } = props;
    const { data } = useGetOfferByIdQuery(id);
    const { data: gallery } = useGetOfferGalleryItemsQuery(id.toString());
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const onImagesClick = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <>
            <PersonalCard
                image={getMediaContent(data?.description?.image)}
                title={data?.description?.title}
                location={data?.where?.address}
                rating={4.3}
                categories={(
                    <OfferPersonalCardCategory
                        categories={data?.description?.categoryIds}
                    />
                )}
                imageBlock={<OfferPersonalCardImageBlock onImagesClick={onImagesClick} />}
            />
            <ModalGallery
                isOpen={isModalOpen}
                onClose={handleModalClose}
                images={gallery}
            />
        </>
    );
});

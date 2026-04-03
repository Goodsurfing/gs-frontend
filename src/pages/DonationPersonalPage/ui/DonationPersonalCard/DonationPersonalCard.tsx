import { memo, useCallback, useState } from "react";
import {
    getMediaContent,
    getMediaContentsArray,
} from "@/shared/lib/getMediaContent";
import { ModalGallery } from "@/shared/ui/ModalGallery/ModalGallery";
import { GetDonation, HeaderDonationCard } from "@/entities/Donation";
import { OfferPersonalCardImageBlock } from "../OfferPersonalCardImageBlock/OfferPersonalCardImageBlock";
import { DonationPersonalCardCategory } from "../DonationPersonalCardCategory/DonationPersonalCardCategory";

interface DonationPersonalCardProps {
    id: string;
    donationData: GetDonation;
    isVolunteer: boolean;
}

export const DonationPersonalCard = memo((props: DonationPersonalCardProps) => {
    const { id, donationData, isVolunteer } = props;
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const onImagesClick = useCallback(() => {
        setModalOpen(true);
    }, []);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const showImageBlock = donationData.galleryImages.length > 0 ? (
        <OfferPersonalCardImageBlock
            onImagesClick={onImagesClick}
            images={getMediaContentsArray(donationData.galleryImages)}
        />
    ) : null;

    return (
        <>
            <HeaderDonationCard
                donationId={id}
                image={getMediaContent(donationData.image?.contentUrl)}
                title={donationData.name}
                location={donationData.address}
                isSuccess={donationData.isSuccess}
                canSupport={donationData.isCanSupport}
                categories={(
                    <DonationPersonalCardCategory
                        categories={donationData.categories}
                    />
                )}
                imageBlock={showImageBlock}
                canEdit={donationData.isCanEdit}
                status={donationData.status}
                isVolunteer={isVolunteer}
                daysLeft={donationData.daysLeft}
                peopleSupportCount={donationData.peopleSupportCount}
                percentAmountCollect={donationData.percentAmountCollect}
            />
            {(donationData.galleryImages.length > 0) && (
                <ModalGallery
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    images={getMediaContentsArray(donationData.galleryImages)}
                />
            )}
        </>
    );
});

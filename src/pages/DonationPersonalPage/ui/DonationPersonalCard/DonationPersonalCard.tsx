import { memo, useCallback, useState } from "react";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ModalGallery } from "@/shared/ui/ModalGallery/ModalGallery";
import { OfferPersonalCardImageBlock } from "../OfferPersonalCardImageBlock/OfferPersonalCardImageBlock";
import { GetDonation, HeaderDonationCard } from "@/entities/Donation";
import { DonationPersonalCardCategory } from "../DonationPersonalCardCategory/DonationPersonalCardCategory";
import { Image } from "@/types/media";

const getGalleryThumbnails = (images: Image[]) => images
    .map((image) => getMediaContent(image, "LARGE"))
    .filter((url): url is string => Boolean(url));

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
            images={getGalleryThumbnails(donationData.galleryImages)}
        />
    ) : null;

    return (
        <>
            <HeaderDonationCard
                donationId={id}
                image={getMediaContent(donationData.image ?? undefined, "LARGE")}
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
                    images={getGalleryThumbnails(donationData.galleryImages)}
                />
            )}
        </>
    );
});

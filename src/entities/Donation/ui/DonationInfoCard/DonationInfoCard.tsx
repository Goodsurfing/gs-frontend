import cn from "classnames";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { GetDonation } from "../../model/types/donationSchema";
import { DonationWhenCard } from "../DonationWhenCard/DonationWhenCard";
import { DonationDescriptionCard } from "../DonationDescriptionCard/DonationDescriptionCard";
import { DonationAddressCard } from "../DonationAddressCard/DonationAddressCard";
import { DonationOrganizationCard } from "../DonationOrganizationCard/DonationOrganizationCard";
import { DonationGalleryCard } from "../DonationGalleryCard/DonationGalleryCard";
import { DonationShareCard } from "../DonationShareCard/DonationShareCard";
import { DonationDonorsCard } from "../DonationDonorsCard/DonationDonorsCard";
import styles from "./DonationInfoCard.module.scss";

interface DonationInfoCardProps {
    className?: string;
    donation: GetDonation;
}

export const DonationInfoCard = memo((props: DonationInfoCardProps) => {
    const { className, donation } = props;
    const { ready } = useTranslation("donation");

    if (!ready) {
        return null;
    }

    return (
        <div className={cn(className)}>
            <DonationWhenCard
                amount={donation.amount}
                dateStart={donation.startDate}
                daysLeft={donation.daysLeft}
                percentAmountCollect={donation.percentAmountCollect}
                isSuccess={donation.isSuccess}
            />
            <DonationDescriptionCard
                description={donation.description}
                className={styles.container}
            />
            <DonationAddressCard
                address={donation.address}
                latitude={donation.latitude}
                longitude={donation.longitude}
                className={styles.container}
            />
            <DonationOrganizationCard
                data={
                    {
                        id: donation.organization.id,
                        name: donation.organization.name,
                        image: donation.image,
                        description: donation.organization.description,
                    }
                }
                className={styles.container}
            />
            <DonationGalleryCard
                galleryImages={donation.galleryImages}
                className={styles.container}
            />
            <DonationDonorsCard
                fundraiseId={donation.id}
                className={styles.container}
            />
            <DonationShareCard donationId={donation.id} title={donation.name} />
        </div>
    );
});

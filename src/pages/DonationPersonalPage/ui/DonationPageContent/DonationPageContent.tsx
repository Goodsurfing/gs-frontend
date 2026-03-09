import cn from "classnames";
import { memo } from "react";
import { DonationInfoCard, GetDonation } from "@/entities/Donation";
import styles from "./DonationPageContent.module.scss";

interface DonationPageContentProps {
    className?: string;
    donationData: GetDonation;
}

export const DonationPageContent = memo((props: DonationPageContentProps) => {
    const { className, donationData } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <DonationInfoCard donation={donationData} />
        </div>
    );
});

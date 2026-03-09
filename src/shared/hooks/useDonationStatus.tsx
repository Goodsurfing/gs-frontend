import { useTranslation } from "react-i18next";
import { DonationStatus } from "@/entities/Donation";

export const useDonationStatus = () => {
    const { t } = useTranslation("donation");

    const donationStatusList: Record<DonationStatus, string> = {
        active: t("donationPersonal.active"),
        close: t("donationPersonal.close"),
        draft: t("donationPersonal.draft"),
    };

    const getDonationStatus = (donationStatus:
    DonationStatus) => donationStatusList[donationStatus];

    return { getDonationStatus };
};

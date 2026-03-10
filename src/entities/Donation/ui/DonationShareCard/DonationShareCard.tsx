import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getDonationPersonalPage } from "@/shared/config/routes/AppUrls";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

import { MAIN_URL } from "@/shared/constants/api";
import styles from "./DonationShareCard.module.scss";

interface DonationShareCardProps {
    donationId: string;
    title: string | null;
}

export const DonationShareCard: FC<DonationShareCardProps> = memo(
    (props: DonationShareCardProps) => {
        const { donationId, title } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("donation");
        return (
            <ShareBlock
                className={styles.wrapper}
                label={t("donationPersonal.Поделиться сбором")}
                url={`${MAIN_URL}${getDonationPersonalPage(locale, donationId)}`}
                textTitle={title ?? ""}
            />
        );
    },
);

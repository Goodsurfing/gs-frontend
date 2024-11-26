import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

import styles from "./OfferShareCard.module.scss";
import { MAIN_URL } from "@/shared/constants/api";

interface OfferShareCardProps {
    offerId: string;
    offerTitle: string;
}

export const OfferShareCard: FC<OfferShareCardProps> = memo((props: OfferShareCardProps) => {
    const { offerId, offerTitle } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("offer");
    return (
        <ShareBlock
            className={styles.wrapper}
            label={t("personalOffer.Поделиться вакансией")}
            url={`${MAIN_URL}${getOfferPersonalPageUrl(locale, offerId)}`}
            textTitle={offerTitle}
        />
    );
});

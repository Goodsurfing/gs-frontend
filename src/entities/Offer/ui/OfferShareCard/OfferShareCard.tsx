import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

import styles from "./OfferShareCard.module.scss";

export const OfferShareCard: FC = memo(() => {
    const { locale } = useLocale();
    const { t } = useTranslation("offer");
    return (
        <ShareBlock
            className={styles.wrapper}
            label={t("personalOffer.Поделиться вакансией")}
            vk={getMainPageUrl(locale)}
            instagram={getMainPageUrl(locale)}
            telegram={getMainPageUrl(locale)}
        />
    );
});

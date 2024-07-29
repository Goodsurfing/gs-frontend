import React, { FC, memo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

import styles from "./OfferShareCard.module.scss";

export const OfferShareCard: FC = memo(() => {
    const { locale } = useLocale();
    return (
        <ShareBlock
            className={styles.wrapper}
            label="Поделиться вакансией"
            vk={getMainPageUrl(locale)}
            instagram={getMainPageUrl(locale)}
            telegram={getMainPageUrl(locale)}
        />
    );
});

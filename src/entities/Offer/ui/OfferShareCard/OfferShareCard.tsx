import React, { FC, memo } from "react";

import { Link } from "react-router-dom";
import styles from "./OfferShareCard.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

export const OfferShareCard: FC = memo(() => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <span>Поделиться вакансией</span>
            <div className={styles.container}>
                <Link to={getMainPageUrl(locale)}>vk</Link>
                <Link to={getMainPageUrl(locale)}>telegram</Link>
                <Link to={getMainPageUrl(locale)}>instagram</Link>
            </div>
        </div>
    );
});

import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./OfferShareCard.module.scss";
import { instaIcon, vkIcon, telegramIcon } from "@/shared/data/icons/socialIcons";

export const OfferShareCard: FC = memo(() => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <span>Поделиться вакансией</span>
            <div className={styles.container}>
                <Link to={getMainPageUrl(locale)}>
                    <img src={vkIcon} alt="vkontakte" />
                </Link>
                <Link to={getMainPageUrl(locale)}>
                    <img src={instaIcon} alt="instagram" />
                </Link>
                <Link to={getMainPageUrl(locale)}>
                    <img src={telegramIcon} alt="telegram" />
                </Link>
            </div>
        </div>
    );
});

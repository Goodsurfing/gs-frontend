import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import {
    instaIcon,
    telegramIcon,
    vkIcon,
} from "@/shared/data/icons/socialIcons";

import styles from "./OfferShareCard.module.scss";

export const OfferShareCard: FC = memo(() => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <span>Поделиться вакансией</span>
            <div className={styles.container}>
                <Link to={getMainPageUrl(locale)}>
                    <img src={vkIcon} alt="vkontakte" className={styles.icon} />
                </Link>
                <Link to={getMainPageUrl(locale)}>
                    <img
                        src={instaIcon}
                        alt="instagram"
                        className={styles.icon}
                    />
                </Link>
                <Link to={getMainPageUrl(locale)}>
                    <img
                        src={telegramIcon}
                        alt="telegram"
                        className={styles.icon}
                    />
                </Link>
            </div>
        </div>
    );
});

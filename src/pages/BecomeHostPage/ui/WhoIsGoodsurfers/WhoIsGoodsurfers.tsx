import React from "react";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

import styles from "./WhoIsGoodsurfers.module.scss";

export const WhoIsGoodsurfers = () => {
    const { locale } = useLocale();

    const navigate = useNavigate();

    const navigateClick = () => {
        navigate(getProfileRolePageUrl(locale));
    };

    return (
        <div className={styles.wrapper}>
            <h2>Кто такие гудсёрферы</h2>
            <p>
                Гудсёрферы – это люди из разных регионов и стран, которые готовы
                приложить свои знания и труд на проживание, питание и опыт. Это
                люди разных возрастов, пола и профессий.
                <br />
                <br />
                <b>Найдите своих идеальных гудсёрферов!</b>
            </p>
            <Button
                className={styles.button}
                color="GREEN"
                size="SMALL"
                variant="FILL"
                onClick={navigateClick}
            >
                Начать сейчас
            </Button>
        </div>
    );
};

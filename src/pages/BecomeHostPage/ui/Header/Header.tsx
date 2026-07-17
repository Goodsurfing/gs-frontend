import React from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";

export const Header = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { t } = useTranslation("become-host");

    const onBecomeHostClick = () => {
        navigate(getProfileRolePageUrl(locale));
    };

    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>
                {t("Принимай у себя гудсёрферов и с их поддержкой развивай свой проект!")}
            </h1>
            <h2 className={styles.description}>
                {t("Зарегистрируйтесь в сервисе Goodsurfing и получите возможность привлекать добровольных помощников со всего мира")}
            </h2>
            <div className={styles.buttonPrice}>
                <Button color="GREEN" size="SMALL" variant="FILL" onClick={onBecomeHostClick}>
                    {t("Стать хостом")}
                </Button>
            </div>
        </section>
    );
};

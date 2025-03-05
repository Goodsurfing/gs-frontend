import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getBecomeHostPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import SectionTitle from "@/shared/ui/SectionTitle/SectionTitle";

import styles from "./BecomeHostContainer.module.scss";

const BecomeHostContainer: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation("main");

    return (
        <div className={styles.wrapper}>
            <SectionTitle>{t("Прими гудсёрферов")}</SectionTitle>
            <p className={styles.text}>
                {t("Получайте помощь")}
            </p>
            <ButtonLink path={getBecomeHostPageUrl(locale)} type="primary">
                {t("Стать хостом")}
            </ButtonLink>
        </div>
    );
};

export default BecomeHostContainer;

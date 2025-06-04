import React, { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "./FindOffer.module.scss";
import Button from "@/shared/ui/Button/Button";
import { Locale } from "@/entities/Locale";
import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";

interface FindOfferProps {
    className?: string;
    locale: Locale;
}

export const FindOffer: FC<FindOfferProps> = (props) => {
    const { className, locale } = props;
    const { t } = useTranslation("find-job");
    const navigate = useNavigate();

    const onNavigate = () => {
        navigate(getProfileRolePageUrl(locale));
    };

    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                <h2 className={styles.title}>
                    {t("Найти сотрудников")}
                </h2>
                <p className={styles.description}>
                    {t("Получайте помощь в своём деле и знакомьтесь с людьми со всего мира.")}
                </p>
                <Button onClick={onNavigate} color="GREEN" size="MEDIUM" variant="FILL" className={styles.button}>
                    {t("Разместить вакансию")}
                </Button>
            </div>
            <div className={styles.image} />
        </section>
    );
};

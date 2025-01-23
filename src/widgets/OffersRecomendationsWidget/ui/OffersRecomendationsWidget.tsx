import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfilePreferencesPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./OffersRecomendationsWidget.module.scss";

interface OffersRecomendationsWidgetProps {
    className?: string;
}

export const OffersRecomendationsWidget: FC<OffersRecomendationsWidgetProps> = memo(
    (props: OffersRecomendationsWidgetProps) => {
        const { className } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("volunteer");

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.top}>
                    <h3>{t("volunteer-dashboard.Возможности, которые вам понравятся")}</h3>
                    <Link
                        to={getProfilePreferencesPageUrl(locale)}
                        className={styles.settings}
                    >
                        {t("volunteer-dashboard.Настроить")}
                    </Link>
                </div>
                <div className={styles.container}>
                    {/* render offers items */}
                </div>
            </div>
        );
    },
);

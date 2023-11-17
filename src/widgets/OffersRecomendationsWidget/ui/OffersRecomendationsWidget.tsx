import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./OffersRecomendationsWidget.module.scss";

interface OffersRecomendationsWidgetProps {
    className?: string;
}

export const OffersRecomendationsWidget: FC<OffersRecomendationsWidgetProps> =
    memo((props: OffersRecomendationsWidgetProps) => {
        const { className } = props;
        const { locale } = useLocale();

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.top}>
                    <h3>Возможности, которые вам понравятся</h3>
                    <Link
                        to={getMainPageUrl(locale)}
                        className={styles.settings}
                    >
                        Настроить
                    </Link>
                </div>
                <div className={styles.container}>
                    {/* render offers items */}
                </div>
            </div>
        );
    });

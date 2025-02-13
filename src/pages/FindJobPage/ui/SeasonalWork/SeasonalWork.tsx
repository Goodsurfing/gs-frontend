import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import styles from "./SeasonalWork.module.scss";

interface SeasonalWorkProps {
    className?: string;
}

export const SeasonalWork: FC<SeasonalWorkProps> = (props) => {
    const { className } = props;
    const { t } = useTranslation("find-job");

    return (
        <div className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Сезонная работа")}</h2>
            <p className={styles.description}>
                {t("Сезонная работа за границей")}
            </p>
        </div>
    );
};

import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import styles from "./HowItStarted.module.scss";

interface HowItStartedProps {
    className?: string;
}

export const HowItStarted: FC<HowItStartedProps> = (
    props: HowItStartedProps,
) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Как всё началось")}</h2>
            <p className={styles.description}>
                {t("Наша команда энтузиастов собралась")}
            </p>
        </section>
    );
};

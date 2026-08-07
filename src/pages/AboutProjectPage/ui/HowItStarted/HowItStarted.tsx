import cn from "classnames";
import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import styles from "./HowItStarted.module.scss";
import { renderBoldText } from "@/shared/lib/renderBoldText";

interface HowItStartedProps {
    className?: string;
    description: string | null;
}

export const HowItStarted: FC<HowItStartedProps> = (
    props: HowItStartedProps,
) => {
    const { className, description } = props;
    const { t } = useTranslation("about-project");
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Как всё началось")}</h2>
            <p className={styles.description}>
                {description && renderBoldText(description)}
            </p>
        </section>
    );
};

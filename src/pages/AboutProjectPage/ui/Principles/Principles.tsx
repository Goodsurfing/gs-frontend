import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { PrinciplesItem } from "../PrinciplesItem/PrinciplesItem";
import styles from "./Principles.module.scss";
import { useAboutProjects } from "../../model/data/useAboutProject";

interface PrinciplesProps {
    className?: string;
}

export const Principles: FC<PrinciplesProps> = (props: PrinciplesProps) => {
    const { className } = props;
    const { t } = useTranslation("about-project");
    const { principlesData } = useAboutProjects();

    const renderPrinciples = useMemo(() => principlesData.map((item, index) => (
        <PrinciplesItem title={item.title} description={item.description} key={index} />
    )), [principlesData]);

    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Принципы ГудСёрфинга")}</h2>
            <div className={styles.content}>{renderPrinciples}</div>
        </section>
    );
};

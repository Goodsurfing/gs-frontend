import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { PrinciplesItem } from "../PrinciplesItem/PrinciplesItem";
import { AboutProjectPrinciples } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./Principles.module.scss";

interface PrinciplesProps {
    className?: string;
    principles: AboutProjectPrinciples[];
}

export const Principles: FC<PrinciplesProps> = (props: PrinciplesProps) => {
    const { className, principles } = props;
    const { t } = useTranslation("about-project");

    const renderPrinciples = useMemo(() => principles.map((item, index) => (
        <PrinciplesItem
            image={getMediaContent(item.image.contentUrl) ?? ""}
            title={item.name}
            description={item.description}
            key={index}
        />
    )), [principles]);

    return (
        <section className={cn(className)}>
            <h2 className={styles.title}>{t("Принципы ГудСёрфинга")}</h2>
            <div className={styles.content}>{renderPrinciples}</div>
        </section>
    );
};

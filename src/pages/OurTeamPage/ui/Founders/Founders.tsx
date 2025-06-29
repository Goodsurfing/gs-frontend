import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { foundersData } from "../../model/data/ourTeam";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";
import styles from "./Founders.module.scss";

interface FoundersProps {
    className?: string;
}

export const Founders: FC<FoundersProps> = memo((props: FoundersProps) => {
    const { className } = props;
    const { t } = useTranslation("our-team");

    const renderItems = useMemo(
        () => foundersData.map((item, index) => (
            <TeamItem
                image={item.image}
                name={item.name}
                description={item.description}
                vk={item.vk}
                telegram={item.telegram}
                key={index}
            />
        )),
        [],
    );
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>{t("Основатели")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

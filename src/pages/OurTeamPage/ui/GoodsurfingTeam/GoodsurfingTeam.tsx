import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { goodSurfingData } from "../../model/data/ourTeam";
import styles from "./GoodsurfingTeam.module.scss";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";

interface GoodsurfingTeamProps {
    className?: string;
}

export const GoodsurfingTeam: FC<GoodsurfingTeamProps> = memo((props: GoodsurfingTeamProps) => {
    const { className } = props;
    const { t } = useTranslation("our-team");

    const renderItems = useMemo(
        () => goodSurfingData.map((item, index) => (
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
            <h2 className={styles.title}>{t("Команда Гудсёрфинга")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

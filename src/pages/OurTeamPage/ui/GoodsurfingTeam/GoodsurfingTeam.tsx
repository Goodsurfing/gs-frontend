import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { goodSurfingData } from "../../model/data/ourTeam";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./GoodsurfingTeam.module.scss";

interface GoodsurfingTeamProps {
    className?: string;
}

export const GoodsurfingTeam: FC<GoodsurfingTeamProps> = memo((props: GoodsurfingTeamProps) => {
    const { className } = props;
    const { t } = useTranslation("our-team");
    const { locale } = useLocale();

    const renderItems = useMemo(
        () => goodSurfingData.map((item, index) => (
            <TeamItem
                image={item.image}
                name={item.name}
                description={item.description}
                vk={item.vk}
                telegram={item.telegram}
                key={index}
                locale={locale}
            />
        )),
        [locale],
    );
    return (
        <section className={cn(className)}>
            <h2 className={styles.title}>{t("Команда Гудсёрфинга")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

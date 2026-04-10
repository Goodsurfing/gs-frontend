import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetOurTeamListQuery } from "@/entities/Admin";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./GoodsurfingTeam.module.scss";

interface GoodsurfingTeamProps {
    className?: string;
}

export const GoodsurfingTeam: FC<GoodsurfingTeamProps> = memo((props: GoodsurfingTeamProps) => {
    const { className } = props;
    const { t } = useTranslation("our-team");
    const { data, isLoading } = useGetOurTeamListQuery({ isFounder: false, limit: 30, page: 1 });
    const { locale } = useLocale();
    const { getFullName } = useGetFullName();

    const renderItems = useMemo(
        () => data?.data.map((item, index) => (
            <TeamItem
                image={getMediaContent(item.image.contentUrl)}
                name={getFullName(item.firstName, item.lastName)}
                description={item.position}
                vk={item.vkontakte}
                telegram={item.telegram}
                id={item.userId}
                key={index}
                locale={locale}
            />
        )),
        [data?.data, getFullName, locale],
    );

    if (isLoading) {
        return (
            <section className={cn(className)}>
                <h2 className={styles.title}>{t("Команда Гудсёрфинга")}</h2>
                <div className={styles.container}>{renderItems}</div>
            </section>
        );
    }

    return (
        <section className={cn(className)}>
            <h2 className={styles.title}>{t("Команда Гудсёрфинга")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

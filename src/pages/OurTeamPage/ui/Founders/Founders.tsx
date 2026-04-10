import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetOurTeamListQuery } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./Founders.module.scss";

interface FoundersProps {
    className?: string;
}

export const Founders: FC<FoundersProps> = memo((props: FoundersProps) => {
    const { className } = props;
    const { t } = useTranslation("our-team");
    const { locale } = useLocale();
    const { data, isLoading } = useGetOurTeamListQuery({ isFounder: true, limit: 30, page: 1 });
    const { getFullName } = useGetFullName();

    const renderItems = useMemo(
        () => data?.data?.map((item, index) => (
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
                <h2 className={styles.title}>{t("Основатели")}</h2>
                <div className={styles.container}>{renderItems}</div>
            </section>
        );
    }

    return (
        <section className={cn(className)}>
            <h2 className={styles.title}>{t("Основатели")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { foundersData } from "../../model/data/ourTeam";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./Founders.module.scss";

interface FoundersProps {
    className?: string;
}

export const Founders: FC<FoundersProps> = memo((props: FoundersProps) => {
    const { className } = props;
    const { t } = useTranslation("our-team");
    const { locale } = useLocale();

    const renderItems = useMemo(
        () => foundersData.map((item, index) => (
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
            <h2 className={styles.title}>{t("Основатели")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { GetExpert } from "@/entities/Academy";

import Section from "@/shared/ui/Section/Section";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";

import styles from "./ExpertsCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullAddress, getFullName } from "@/shared/lib/getFullName";
import { useLocale } from "@/app/providers/LocaleProvider";

interface ExpertsCardProps {
    experts: GetExpert[];
}

export const ExpertsCard: FC<ExpertsCardProps> = (props) => {
    const { experts } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("academy");

    const renderItems = useMemo(
        () => experts.map((item, index) => (
            <TeamItem
                image={getMediaContent(item.image, "MEDIUM")}
                name={getFullName(item.firstName, item.lastName)}
                description={item.project}
                address={getFullAddress(item.city, item.country)}
                key={index}
                locale={locale}
            />
        )),
        [experts, locale],
    );

    if (experts.length === 0) {
        return null;
    }

    return (
        <Section
            className={styles.wrapper}
            classNameContent={styles.content}
            title={t("Эксперты")}
        >
            {renderItems}
        </Section>
    );
};

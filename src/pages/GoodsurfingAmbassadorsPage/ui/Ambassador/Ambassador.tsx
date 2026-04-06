import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";
import { useGetAmbassadorsQuery } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullAddress, useGetFullName } from "@/shared/lib/getFullName";
import styles from "./Ambassador.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface AmbassadorProps {
    className?: string;
}

export const Ambassador: FC<AmbassadorProps> = memo((props: AmbassadorProps) => {
    const { className } = props;
    const { t } = useTranslation("ambassadors");
    const { data } = useGetAmbassadorsQuery({ limit: 50, page: 1 });
    const { getFullName } = useGetFullName();
    const { locale } = useLocale();

    const renderItems = useMemo(
        () => {
            if (!data) return null;
            return data.data.map((item, index) => (
                <TeamItem
                    image={getMediaContent(item.image.contentUrl)}
                    name={getFullName(item.firstName, item.lastName)}
                    description={item.description}
                    address={getFullAddress(item.city, item.country)}
                    key={index}
                    locale={locale}
                />
            ));
        },
        [data, getFullName, locale],
    );
    return (
        <section className={cn(className)}>
            <h2 className={styles.title}>{t("Наши Амбассадоры")}</h2>
            <div className={styles.container}>{renderItems}</div>
        </section>
    );
});

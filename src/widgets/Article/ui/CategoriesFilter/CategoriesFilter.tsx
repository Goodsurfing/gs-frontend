import React, { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { BlogCategories } from "@/features/ArticleForm";
import styles from "./CategoriesFilter.module.scss";

interface CategoriesFilterProps {
    className?: string;
    locale: Locale;
    value?: number;
    onChange: (value?: number) => void;
}

export const CategoriesFilter: FC<CategoriesFilterProps> = (props) => {
    const { t } = useTranslation("blog");
    const {
        className, value, onChange, locale,
    } = props;

    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.title}>{t("Категория")}</span>
            <BlogCategories
                locale={locale}
                exclusive
                value={value ? Number(value) : undefined}
                onChange={(newValue) => onChange(
                    newValue ? Number(newValue) : undefined,
                )}
            />
        </div>
    );
};

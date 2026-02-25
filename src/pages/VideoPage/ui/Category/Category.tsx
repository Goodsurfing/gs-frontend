import React, { FC } from "react";
import cn from "classnames";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { OfferCategories } from "@/widgets/OfferCategories";
import styles from "./Category.module.scss";

interface CategoryProps {
    className?: string;
    locale: Locale;
    value?: number;
    onChange: (value?: number) => void;
}

export const Category: FC<CategoryProps> = (props) => {
    const {
        className, locale, value, onChange,
    } = props;

    return (
        <div className={cn(styles.wrapper, className)}>
            <span className={styles.title}>Категория</span>
            <OfferCategories
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

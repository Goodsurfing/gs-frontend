import React, { FC } from "react";
import cn from "classnames";
import { CategoriesFilter } from "@/widgets/Article";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

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
        <div className={cn(className)}>
            <CategoriesFilter value={value} onChange={onChange} locale={locale} />
        </div>
    );
};

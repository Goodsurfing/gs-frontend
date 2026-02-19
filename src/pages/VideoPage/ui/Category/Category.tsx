import React, { FC, useState } from "react";
import cn from "classnames";
import { CategoriesFilter } from "@/widgets/Article";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface CategoryProps {
    className?: string;
    locale: Locale;
}

export const Category: FC<CategoryProps> = (props) => {
    const { className, locale } = props;
    const [categoryValue, setCategoryValue] = useState<number | undefined>();

    const handleCategoryChange = (newValue?: number) => {
        if (newValue) setCategoryValue(newValue);
    };

    return (
        <div className={cn(className)}>
            <CategoriesFilter
                value={categoryValue}
                onChange={handleCategoryChange}
                locale={locale}
            />
        </div>
    );
};

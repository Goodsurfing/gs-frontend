import React, { FC, useState } from "react";
import cn from "classnames";
import { CategoriesFilter } from "@/widgets/Article";

interface CategoryProps {
    className?: string;
}

export const Category: FC<CategoryProps> = (props) => {
    const { className } = props;
    const [categoryValue, setCategoryValue] = useState("Все категории");

    const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
        if (newValue) setCategoryValue(newValue);
    };

    return (
        <div className={cn(className)}>
            <CategoriesFilter value={categoryValue} onChange={handleCategoryChange} />
        </div>
    );
};

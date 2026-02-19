import React, { FC } from "react";
import cn from "classnames";
import { Filter, TagsOption } from "@/features/Article";

interface FilterProps {
    className?: string;
    value: TagsOption;
    onChange: (value: TagsOption) => void;
}

export const ArticleFilter: FC<FilterProps> = (props) => {
    const { className, value, onChange } = props;
    return (
        <div className={cn(className)}>
            <Filter value={value} onChange={onChange} />
        </div>
    );
};

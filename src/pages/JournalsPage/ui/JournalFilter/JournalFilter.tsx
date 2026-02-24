import React, { FC } from "react";
import cn from "classnames";
import { Filter, TagsOption } from "@/features/Article";
import styles from "./JournalFilter.module.scss";

interface JournalFilterProps {
    className?: string;
    value: TagsOption;
    onChange: (value: TagsOption) => void;
}

export const JournalFilter: FC<JournalFilterProps> = (props) => {
    const { className, value, onChange } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <Filter value={value} onChange={onChange} />
        </div>
    );
};

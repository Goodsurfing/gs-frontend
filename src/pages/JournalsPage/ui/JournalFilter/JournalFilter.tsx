import React, { FC } from "react";
import cn from "classnames";
import styles from "./JournalFilter.module.scss";
import { Filter } from "@/features/Article";

interface JournalFilterProps {
    className?: string;
}

export const JournalFilter: FC<JournalFilterProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <Filter value="new" onChange={() => {}} />
        </div>
    );
};

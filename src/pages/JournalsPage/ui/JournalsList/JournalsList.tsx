import React, { FC, useMemo } from "react";
import cn from "classnames";
import { Journal, JournalCard } from "@/entities/Article";
import styles from "./JournalsList.module.scss";

interface JournalsListProps {
    data?: Journal[]
    className?: string;
}

export const JournalsList: FC<JournalsListProps> = (props) => {
    const { data, className } = props;
    const renderJournals = useMemo(() => data?.map((journal, key) => (
        <JournalCard
            journal={journal}
            key={key}
            className={styles.article}
        />
    )), [data]);

    if (!data) {
        return (
            <div>Журналов не было найдено</div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>{renderJournals}</div>
    );
};

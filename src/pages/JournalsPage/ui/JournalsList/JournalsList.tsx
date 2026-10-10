import React, { FC, useMemo } from "react";
import cn from "classnames";
import { JournalCard, JournalCardType } from "@/entities/Article";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./JournalsList.module.scss";

interface JournalsListProps {
    data?: JournalCardType[]
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
        return null;
    }

    if (data.length === 0) {
        return (
            <Text
                className={styles.empty}
                textSize="primary"
                text="Журналы не найдены"
            />
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>{renderJournals}</div>
    );
};

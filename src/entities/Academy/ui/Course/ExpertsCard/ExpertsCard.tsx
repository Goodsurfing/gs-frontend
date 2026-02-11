import React, { FC, useMemo } from "react";

import { GetExpert } from "@/entities/Academy";

import Section from "@/shared/ui/Section/Section";
import { TeamItem } from "@/shared/ui/TeamItem/TeamItem";

import styles from "./ExpertsCard.module.scss";

interface ExpertsCardProps {
    experts: GetExpert[];
}

export const ExpertsCard: FC<ExpertsCardProps> = (props) => {
    const { experts } = props;

    const renderItems = useMemo(
        () => experts.map((item, index) => (
            <TeamItem
                image={item.image}
                name={item.name}
                description={item.description}
                address={item.address}
                key={index}
            />
        )),
        [experts],
    );

    if (experts.length === 0) {
        return null;
    }

    return (
        <Section
            className={styles.wrapper}
            classNameContent={styles.content}
            title="Эксперты"
        >
            {renderItems}
        </Section>
    );
};

import React, { FC } from "react";
import styles from "./TextCard.module.scss";
import Section from "@/shared/ui/Section/Section";

interface TextCardProps {
    title: string;
    text?: string;
}

export const TextCard: FC<TextCardProps> = (props) => {
    const { title, text } = props;

    if (!text) {
        return null;
    }

    return (
        <Section className={styles.wrapper} title={title}>
            {text}
        </Section>
    );
};

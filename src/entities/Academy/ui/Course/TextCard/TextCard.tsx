import React, { FC } from "react";
import Section from "@/shared/ui/Section/Section";
import styles from "./TextCard.module.scss";

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

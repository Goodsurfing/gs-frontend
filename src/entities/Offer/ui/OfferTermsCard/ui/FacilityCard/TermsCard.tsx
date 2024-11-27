import React, { FC, memo } from "react";

import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./TermsCard.module.scss";

interface TermsCardProps {
    icon: string;
    text: string;
}

export const TermsCard: FC<TermsCardProps> = memo(
    (props: TermsCardProps) => {
        const {
            icon, text,
        } = props;
        return (
            <div className={styles.wrapper}>
                <IconComponent className={styles.icon} icon={icon} alt={text} />
                <span className={styles.text}>{text}</span>
            </div>
        );
    },
);

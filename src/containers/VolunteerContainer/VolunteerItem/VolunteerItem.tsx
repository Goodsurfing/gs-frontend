import React, { FC } from "react";

import styles from "./VolunteerItem.module.scss";

interface VolunteerItemProps {
    number: number;
    title: string;
}

const VolunteerItem: FC<VolunteerItemProps> = ({ title, number }) => {
    return (
        <div className={styles.item}>
            <div className={styles.number}>{number}</div>
            <span className={styles.title}>{title}</span>
        </div>
    );
};

export default VolunteerItem;

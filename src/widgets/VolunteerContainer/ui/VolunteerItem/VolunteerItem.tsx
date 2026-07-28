import React, { FC } from "react";

import styles from "./VolunteerItem.module.scss";

interface VolunteerItemProps {
    number: number;
    title: string;
    dataAos?: string;
}

const VolunteerItem: FC<VolunteerItemProps> = ({ title, number, dataAos }) => (
    <div className={styles.item} data-aos={dataAos}>
        <div className={styles.number}>{number}</div>
        <span className={styles.title}>{title}</span>
    </div>
);

export default VolunteerItem;

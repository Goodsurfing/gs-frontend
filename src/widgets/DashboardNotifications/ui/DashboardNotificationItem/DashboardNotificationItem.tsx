import React, { FC } from "react";

import styles from "./DashboardNotificationItem.module.scss";

interface DashboardNotificationItemProps {
    title: string;
    date: string;
    content: string;
}

export const DashboardNotificationItem: FC<DashboardNotificationItemProps> = ({
    title, date, content,
}) => (
    <div className={styles.wrapper}>
        <p className={styles.title}>{title}</p>
        <p className={styles.date}>{date}</p>
        <p className={styles.content}>{content}</p>
    </div>
);

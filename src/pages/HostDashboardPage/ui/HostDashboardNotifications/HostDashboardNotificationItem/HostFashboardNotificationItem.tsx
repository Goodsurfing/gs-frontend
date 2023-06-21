import React, { FC } from "react";

import styles from "./HostFashboardNotificationItem.module.scss";

interface IHostDashboardNotificationItem {
    title: string;
    date: string;
    content: string;
}

const HostFashboardNotificationItem: FC<IHostDashboardNotificationItem> = ({
    title, date, content,
}) => {
    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>{title}</p>
            <p className={styles.date}>{date}</p>
            <p className={styles.content}>{content}</p>
        </div>
    );
};

export default HostFashboardNotificationItem;

import React, { FC } from 'react';

import styles from './HostFashboardNotificationItem.module.scss';

interface IHostFashboardNotificationItem {
  title: string;
  date: string;
  content: string;
}

const HostFashboardNotificationItem: FC<IHostFashboardNotificationItem> = ({ title, date, content }) => (
    <div className={styles.wrapper}>
        <p className={styles.title}>{title}</p>
        <p className={styles.date}>{date}</p>
        <p className={styles.content}>{content}</p>
    </div>
);

export default HostFashboardNotificationItem;

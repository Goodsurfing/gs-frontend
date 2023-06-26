import React from "react";

import NotificationDateStorage from "@/shared/utils/storage/NotificationDateStorage";

import styles from "./HostDashboardNotifications.module.scss";
import HostDashboardNotificationItem from "./HostDashboardNotificationItem/HostFashboardNotificationItem";

const HostDashboardNotifications = () => {
    const notificationDateStorage = new NotificationDateStorage();
    notificationDateStorage.setNotificationDate();

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleWrapper}>
                <h3 className={styles.title}>Уведомления</h3>
            </div>
            <div className={styles.notificationItems}>
                <HostDashboardNotificationItem
                    title="Добро пожаловать!"
                    date={notificationDateStorage.getSavedDate()}
                    content="Рады приветствовать вас на нашем сайте. Для вашего удобства предлагаем максимально подробно заполнить свой профиль."
                />
            </div>
        </div>
    );
};

export default HostDashboardNotifications;

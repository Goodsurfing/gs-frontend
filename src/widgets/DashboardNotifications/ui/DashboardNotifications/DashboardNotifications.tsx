import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import cn from "classnames";
import NotificationDateStorage from "@/shared/utils/storage/NotificationDateStorage";

import styles from "./DashboardNotifications.module.scss";
import { DashboardNotificationItem } from "../DashboardNotificationItem/DashboardNotificationItem";

interface DashboardNotificationsProps {
    className?: string;
}

export const DashboardNotifications: FC<DashboardNotificationsProps> = (props) => {
    const { className } = props;
    const notificationDateStorage = new NotificationDateStorage();
    notificationDateStorage.setNotificationDate();

    const { t } = useTranslation("volunteer");

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.titleWrapper}>
                <h3 className={styles.title}>{t("volunteer-dashboard.Уведомления")}</h3>
            </div>
            <div className={styles.notificationItems}>
                <DashboardNotificationItem
                    title="Добро пожаловать!"
                    date={notificationDateStorage.getSavedDate()}
                    content="Рады приветствовать вас на нашем сайте. Для вашего удобства предлагаем максимально подробно заполнить свой профиль."
                />
            </div>
        </div>
    );
};

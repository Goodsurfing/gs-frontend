import { memo } from "react";

import { useTranslation } from "react-i18next";
import styles from "./HostFillTitle.module.scss";

interface HostFillTitleProps {
    text?: string;
    isLoading: boolean;
}

export const HostFillTitle = memo((props: HostFillTitleProps) => {
    const { text, isLoading } = props;
    const { t } = useTranslation("host");

    let title: string = t("host-dashboard.Загрузка...");

    if (text && !isLoading) {
        title = text;
    }

    if (!isLoading && !text) {
        title = t("host-dashboard.Заполненность профиля");
    }

    return (
        <h3 className={styles.text}>{title}</h3>
    );
});

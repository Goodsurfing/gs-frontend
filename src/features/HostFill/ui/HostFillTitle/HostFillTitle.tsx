import { memo } from "react";

import styles from "./HostFillTitle.module.scss";

interface HostFillTitleProps {
    text?: string;
    isLoading: boolean;
}

export const HostFillTitle = memo((props: HostFillTitleProps) => {
    const { text, isLoading } = props;

    let title: string = "Загузка";

    if (text && !isLoading) {
        title = text;
    }

    if (!isLoading && !text) {
        title = "Заполненность профиля";
    }

    return (
        <h3 className={styles.text}>{title}</h3>
    );
});

import React, { memo } from "react";

import styles from "./Text.module.scss";

export const Text = memo(() => {
    return (
        <div>
            <h4 className={styles.title}>
                Видеогалерея организации
            </h4>
            <p className={styles.description}>
                Добавьте ссылки на видеоролики с Youtube или Vimeo,
                чтобы они отображались в вашем профиле.
                Убедитесь, что в настройках видео они открыты для публичного просмотра.
            </p>
        </div>
    );
});

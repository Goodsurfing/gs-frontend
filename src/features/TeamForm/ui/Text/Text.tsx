/* eslint-disable max-len */
import React, { memo } from "react";

import styles from "./Text.module.scss";

export const Text = memo(() => (
    <div>
        <h4 className={styles.title}>
            Команда организации
        </h4>
        <p className={styles.description}>
            Владельцы команд могут добавлять участников в команду своей организации, добавляя их адреса электронной почты. У них должна быть учетная запись на сайте.
        </p>
    </div>
));

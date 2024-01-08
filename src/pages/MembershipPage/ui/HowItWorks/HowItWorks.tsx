import React from "react";

import { Items } from "../Items/Items";
import styles from "./HowItWorks.module.scss";

export const HowItWorks = () => (
    <section className={styles.wrapper}>
        <h2 className={styles.title}>Как это работает</h2>
        <p className={styles.description}>
            С оформленным членством Гудсёрфинга вы можете пользоваться всеми
            возможностями нашего сервиса без каких-либо ограничений.
        </p>
        <div className={styles.items}>
            <Items />
        </div>
    </section>
);

import React from "react";
import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.scss";

export const NotFoundPage = () => (
    <div className={styles.wrapper}>
        <div className={styles.container}>
            <h1>404</h1>
            <p className={styles.smile}>🤕</p>
            <p className={styles.subtitle}>
                Извините, но страница на которую вы хотели перейти
                <br />

                не существует.
            </p>
            <div className={styles.return}>
                <Link className={styles.link} to="/">Главная</Link>
            </div>
        </div>
    </div>
);

import React from "react";

import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";

export const Header = () => (
    <div className={styles.wrapeprImage}>
        <h1 className={styles.title}>
            <span>Оформи членство Гудсёрфинга</span>
            <br />
            <span>и открой для себя бескрайний мир</span>
            <br />
            <span>путешествий со смыслом!</span>
        </h1>
        <ul className={styles.list}>
            <li>Неограниченный доступ ко всем направлениям и видам путешествий</li>
            <li>Прямое общение с хостом </li>
            <li>Поддержка в путешествиях со стороны Гудсёрфинга</li>
            <li>Доступ к образовательным материалам </li>
            <li>Поддержка интересного и важного проекта</li>
        </ul>
        <div className={styles.buttonPrice}>
            <Button color="GREEN" size="SMALL" variant="FILL">Получить членство</Button>
            <span className={styles.price}>1 500 руб</span>
        </div>
    </div>
);

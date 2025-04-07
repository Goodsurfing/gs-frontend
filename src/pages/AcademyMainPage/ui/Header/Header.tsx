import React from "react";

import Button from "@/shared/ui/Button/Button";

import styles from "./Header.module.scss";

export const Header = () => (
    <div className={styles.wrapper}>
        <div className={styles.content}>
            <h1>Учитесь гудсёрфингу вместе с нами!</h1>
            <p>
                Goodsurfing — способ путешествовать недорого, занимаясь
                интересным и важным делом с помощью волонтёрства или экспедиций
            </p>
            <Button className={styles.button} color="GREEN" size="MEDIUM" variant="FILL">
                Выбрать курс
            </Button>
        </div>
    </div>
);

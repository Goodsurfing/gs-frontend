import React from "react";
import styles from "./WhoIsGoodsurfers.module.scss";
import Button from "@/shared/ui/Button/Button";

export const WhoIsGoodsurfers = () => (
    <div className={styles.wrapper}>
        <h2>Кто такие гудсёрферы</h2>
        <p>
            Гудсёрферы – это люди из разных регионов и стран,
            которые готовы приложить свои знания и труд на проживание,
            питание и опыт. Это люди разных возрастов, пола и профессий.
            <br />
            <br />
            <b>Найдите своих идеальных гудсёрферов!</b>
        </p>
        <Button className={styles.button} color="GREEN" size="SMALL" variant="FILL">Начать сейчас</Button>
    </div>
);

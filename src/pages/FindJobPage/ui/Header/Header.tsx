import React from "react";

import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";

export const Header = () => (
    <section className={styles.wrapeprImage}>
        {/* <div className={styles.innerWrapper}> */}
        <h1 className={styles.title}>Совмещай работу и путешествие!</h1>
        <h2 className={styles.description}>
            Выездная сезонная работа на море, в горах и на природе!
        </h2>
        <div className={styles.buttonPrice}>
            <Button color="GREEN" size="SMALL" variant="FILL">
                Найти работу
            </Button>
        </div>
        {/* </div> */}
    </section>
);

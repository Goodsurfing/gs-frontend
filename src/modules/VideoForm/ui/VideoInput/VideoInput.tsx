import React, { memo } from "react";

import styles from "./VideoInput.module.scss";
import Input from "@/UI/Input/Input";
import AddButton from "@/UI/AddButton/AddButton";

export const VideoInput = memo(() => {
    return (
        <div className={styles.wrapper}>
            <label htmlFor="input" className={styles.text}>Ссылка на видео</label>
            <div className={styles.contentWrapper}>
                <Input id="input" value="" placeholder="Ссылка на видео" />
                <AddButton className={styles.add}>
                    Добавить видео
                </AddButton>
            </div>
        </div>
    );
});

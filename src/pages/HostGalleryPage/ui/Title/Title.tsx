import React from "react";

import styles from "./Title.module.scss";

export const Title = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Фотогалерея организации</h1>
            <p className={styles.text}>
                Добавьте сюда не менее 6 фотографий,
                которые характеризуют вашу организацию и ваши предложения.
                Волонтёры в одну из первых очередей обращают
                внимание на фотографии при выборе проекта.
                Добавьте фотографии места проживания и работы
                волонтёров, а также происходящих у вас событий.
            </p>
        </div>
    );
};

import React, { FC } from "react";

import Button from "@/components/ui/Button/Button";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";

import styles from "./BecomeHostContainer.module.scss";

const BecomeHostContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            <SectionTitle>Прими гудсёрферов</SectionTitle>
            <p className={styles.text}>
                Получайте помощь в своём деле и знакомьтесь с людьми со всего
                мира. Гудсёрферы не только принесут пользу, но и помогут
                познакомиться с новыми культурами, распространить информацию о
                вас, получить экспертов по различным направлениям.
            </p>
            <Button path={"/"} type={"primary"}>
                Стать хостом
            </Button>
        </div>
    );
};

export default BecomeHostContainer;

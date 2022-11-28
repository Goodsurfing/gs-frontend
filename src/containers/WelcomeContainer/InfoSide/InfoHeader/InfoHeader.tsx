import React, { FC } from "react";
import { Link } from "react-router-dom";

import Arrow from "@/components/ui/Arrow/Arrow";
import Button from "@/components/ui/Button/Button";

import ruIcon from "@/assets/icons/langs/ru.svg";

import styles from "./InfoHeader.module.scss";

const InfoHeader: FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.selectLang}>
                <img src={ruIcon} alt="Russian" />
                <Arrow isOpen={false} />
            </div>
            <div className={styles.link}>
                <Link to={"/"}>Как это работает?</Link>
            </div>
            <div className={styles.link}>
                <Link to={"/"}>Cообщество</Link>
                <Arrow isOpen={false} />
            </div>
            <div className={styles.link}>
                <Link to={"/"}>Вход</Link>
            </div>
            <div className={styles.link}>
                <Button className={styles.btn} type={"outlined"} path={"/"}>
                    Регистрация
                </Button>
            </div>
        </header>
    );
};

export default InfoHeader;

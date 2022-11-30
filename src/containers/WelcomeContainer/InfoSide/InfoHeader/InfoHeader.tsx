import cn from "classnames";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import Popup from "@/components/Popup/Popup";
import Arrow from "@/components/ui/Arrow/Arrow";
import Button from "@/components/ui/Button/Button";

import styles from "./InfoHeader.module.scss";
import {AppRoutesEnum} from "@/routes/types";

const InfoHeader: FC = () => {
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);

    return (
        <>
            <div
                className={cn(styles.menu, {
                    [styles.active]: menuIsOpen,
                })}
            >
                <div className={styles.link}>
                    <Link to={"/"}>Как это работает?</Link>
                </div>
                <div className={styles.link}>
                    <Link to={"/"}>Cообщество</Link>
                </div>
                <div className={styles.link}>
                    <Link to={"/"}>Вход</Link>
                </div>
                <div className={styles.link}>
                    <Link to={AppRoutesEnum.SIGNUP}>Регистрация</Link>
                </div>
            </div>

            <header className={styles.header}>
                <ChangeLanguage />
                <div className={styles.link}>
                    <Link to={"/"}>Как это работает?</Link>
                </div>
                <div
                    className={styles.link}
                    onClick={() => setLinkIsOpen(!linkIsOpen)}
                >
                    <Link to={"/"}>Cообщество</Link>
                    <Arrow isOpen={linkIsOpen} />
                    <Popup isOpen={linkIsOpen} className={styles.popup}>
                        <Link to={"/"}>Блог</Link>
                        <Link to={"/"}>Видео</Link>
                        <Link to={"/"}>Эксперты</Link>
                        <Link to={"/"}>Амбассадоры</Link>
                        <Link to={"/"}>Курсы</Link>
                        <Link to={"/"}>Клубы</Link>
                        <Link to={"/"}>Журнал</Link>
                    </Popup>
                </div>
                <div className={styles.link}>
                    <Link to={"/"}>Вход</Link>
                </div>
                <div className={styles.link}>
                    <Button className={styles.btn} type={"outlined"} path={AppRoutesEnum.SIGNUP}>
                        Регистрация
                    </Button>
                </div>
                <div
                    className={cn(styles.burger, {
                        [styles.open]: menuIsOpen,
                    })}
                    onClick={() => setMenuIsOpen(!menuIsOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </header>
        </>
    );
};

export default InfoHeader;

import cn from "classnames";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import Arrow from "@/components/ui/Arrow/Arrow";
import Button from "@/components/ui/Button/Button";

import styles from "./InfoHeader.module.scss";

const InfoHeader: FC = () => {
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
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
                    <Arrow isOpen={false} />
                </div>
                <div className={styles.link}>
                    <Link to={"/"}>Вход</Link>
                </div>
                <div className={styles.link}>
                    <Link to={"/"}>Регистрация</Link>
                </div>
            </div>
            <header className={styles.header}>
                <ChangeLanguage />
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

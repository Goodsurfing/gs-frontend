import React, { FC } from "react";

import cn from "classnames";
import logo from "@/shared/assets/icons/logo.svg";

import styles from "./Header.module.scss";
import { ChangeLanguage } from "@/widgets/ChangeLanguage";

interface HeaderProps {
    className?: string
}

export const Header: FC<HeaderProps> = ({ className }) => {
    return (
        <header className={cn(styles.wrapper, className)}>
            <div className={styles.logo}>
                <img src={logo} alt="goodsurfing" />
            </div>
            <ChangeLanguage />
            <nav className={styles.nav}>
                <ul className={styles.navContainer}>
                    <li className={styles.navItem} />
                    <li className={styles.navItem} />
                    <li className={styles.navItem} />
                </ul>
            </nav>
            <div className={styles.authBtns}>
                
            </div>
        </header>
    );
};

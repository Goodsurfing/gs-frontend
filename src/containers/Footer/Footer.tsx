import React, { FC } from "react";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";

import footerLogo from "@/assets/icons/footer/logo.svg";

import styles from "./Footer.module.scss";

const Footer: FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <div className={styles.logo}>
                        <img src={footerLogo} alt="GoodSurfing" />
                        <ChangeLanguage />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

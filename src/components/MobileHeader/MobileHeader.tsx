import cn from "classnames";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import { useAppSelector } from "@/shared/hooks/redux";

import mobileLogotype from "@/shared/assets/icons/mobile-header-logo.svg";

import styles from "./MobileHeader.module.scss";
import { RoutePath } from "@/routes/config/RouterConfig";

const MobileHeader: FC = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => {
        return state.login;
    });

    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

    return (
        <>
            <header className={styles.header}>
                <Link to="/">
                    <img
                        src={mobileLogotype}
                        alt="GoodSurfing"
                        className={styles.logo}
                    />
                </Link>

                <ChangeLanguage />
                <div
                    className={cn(styles.burger, {
                        [styles.open]: menuIsOpen,
                    })}
                    onClick={() => {
                        return setMenuIsOpen(!menuIsOpen);
                    }}
                >
                    <span />
                    <span />
                    <span />
                </div>
            </header>

            <div
                className={cn(styles.menu, {
                    [styles.active]: menuIsOpen,
                })}
            >
                <div className={styles.link}>
                    <Link to="/">{t("main.welcome.header.how-it-work")}</Link>
                </div>
                <div className={styles.link}>
                    <Link to="/">
                        {t("main.welcome.header.community.title")}
                    </Link>
                </div>
                <div className={styles.link}>
                    {token ? (
                        <Link to={RoutePath.main}>Категории</Link>
                    ) : (
                        <Link to={RoutePath.sign_in}>
                            {t("main.welcome.header.sign-in")}
                        </Link>
                    )}
                </div>
                <div className={styles.link}>
                    <Link to={RoutePath.sign_up}>
                        {t("main.welcome.header.sign-up")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MobileHeader;

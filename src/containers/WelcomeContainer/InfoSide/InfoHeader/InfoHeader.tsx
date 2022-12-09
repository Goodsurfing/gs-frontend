import cn from "classnames";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import Popup from "@/components/Popup/Popup";
import Arrow from "@/components/ui/Arrow/Arrow";
import Button from "@/components/ui/Button/Button";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import { AppRoutesEnum } from "@/routes/types";

import { logout } from "@/store/reducers/loginSlice";

import styles from "./InfoHeader.module.scss";

const InfoHeader: FC = () => {
    const { t } = useTranslation();

    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);

    const { token } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <>
            <div
                className={cn(styles.menu, {
                    [styles.active]: menuIsOpen,
                })}
            >
                <div className={styles.link}>
                    <Link to={"/"}>{t("main.welcome.header.how-it-work")}</Link>
                </div>
                <div className={styles.link}>
                    <Link to={"/"}>
                        {t("main.welcome.header.community.title")}
                    </Link>
                </div>
                <div className={styles.link}>
                    {token ? (
                        <Link to={AppRoutesEnum.CATEGORIES}>Категории</Link>
                    ) : (
                        <Link to={AppRoutesEnum.SIGNIN}>
                            {t("main.welcome.header.sign-in")}
                        </Link>
                    )}
                </div>
                <div className={styles.link}>
                    <Link to={AppRoutesEnum.SIGNUP}>
                        {t("main.welcome.header.sign-up")}
                    </Link>
                </div>
            </div>

            <header className={styles.header}>
                <ChangeLanguage />
                <div className={styles.link}>
                    <Link to={"/"}>{t("main.welcome.header.how-it-work")}</Link>
                </div>
                <div
                    className={styles.link}
                    onClick={() => setLinkIsOpen(!linkIsOpen)}
                >
                    <Link to={"/"}>
                        {t("main.welcome.header.community.title")}
                    </Link>
                    <Arrow isOpen={linkIsOpen} />
                    <Popup isOpen={linkIsOpen} className={styles.popup}>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.blog")}
                        </Link>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.video")}
                        </Link>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.experts")}
                        </Link>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.ambassadors")}
                        </Link>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.courses")}
                        </Link>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.clubs")}
                        </Link>
                        <Link to={"/"}>
                            {t("main.welcome.header.community.journal")}
                        </Link>
                    </Popup>
                </div>
                <div className={styles.link}>
                    {token ? (
                        <Link to={AppRoutesEnum.CATEGORIES}>Категории</Link>
                    ) : (
                        <Link to={`../${AppRoutesEnum.SIGNIN}`}>
                            {t("main.welcome.header.sign-in")}
                        </Link>
                    )}
                </div>
                {token ? (
                    <div className={styles.link}>
                        <Button
                            onClick={() => handleLogout()}
                            className={styles.btn}
                            variant={"outlined"}
                        >
                            {t("main.welcome.header.exit")}
                        </Button>
                    </div>
                ) : (
                    <div className={styles.link}>
                        <ButtonLink
                            className={styles.btn}
                            type={"outlined"}
                            path={AppRoutesEnum.SIGNUP}
                        >
                            {t("main.welcome.header.sign-up")}
                        </ButtonLink>
                    </div>
                )}
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

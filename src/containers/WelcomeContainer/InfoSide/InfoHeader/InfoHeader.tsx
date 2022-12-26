import React, { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Popup from "@/components/Popup/Popup";
import Arrow from "@/components/ui/Arrow/Arrow";
import Button from "@/components/ui/Button/Button";
import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { AppRoutesEnum, ProfileRoutesEnum } from "@/routes/types";

import { logout } from "@/store/reducers/loginSlice";

import styles from "./InfoHeader.module.scss";

const InfoHeader: FC = () => {
    const { t } = useTranslation();

    const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);

    const { token } = useAppSelector((state) => {
        return state.login;
    });
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const communityRef = useRef(null);

    const handleClickOutside = () => {
        setLinkIsOpen(false);
    };

    useOnClickOutside(communityRef, handleClickOutside);

    return (
        <>
            <div className={styles.mobile__header__wrapper}>
                <MobileHeader />
            </div>
            <header className={styles.header}>
                <ChangeLanguage />
                <div className={styles.link}>
                    <Link to="/">{t("main.welcome.header.how-it-work")}</Link>
                </div>
                <div
                    ref={communityRef}
                    className={styles.link}
                    onClick={() => {
                        return setLinkIsOpen(!linkIsOpen);
                    }}
                >
                    <p>{t("main.welcome.header.community.title")}</p>
                    <Arrow isOpen={linkIsOpen} />
                    <Popup isOpen={linkIsOpen} className={styles.popup}>
                        <Link to="/">
                            {t("main.welcome.header.community.blog")}
                        </Link>
                        <Link to="/">
                            {t("main.welcome.header.community.video")}
                        </Link>
                        <Link to="/">
                            {t("main.welcome.header.community.experts")}
                        </Link>
                        <Link to="/">
                            {t("main.welcome.header.community.ambassadors")}
                        </Link>
                        <Link to="/">
                            {t("main.welcome.header.community.courses")}
                        </Link>
                        <Link to="/">
                            {t("main.welcome.header.community.clubs")}
                        </Link>
                        <Link to="/">
                            {t("main.welcome.header.community.journal")}
                        </Link>
                    </Popup>
                </div>
                {token ? (
                    <>
                        <div className={styles.link}>
                            <Link to={ProfileRoutesEnum.INFO}>
                                Личный кабинет
                            </Link>
                        </div>
                        <div className={styles.link}>
                            <Button
                                onClick={() => {
                                    return handleLogout();
                                }}
                                className={styles.btn}
                                variant="outlined"
                            >
                                {t("main.welcome.header.exit")}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.link}>
                            <LocaleLink to={AppRoutesEnum.SIGNIN}>
                                {t("main.welcome.header.sign-in")}
                            </LocaleLink>
                        </div>
                        <div className={styles.link}>
                            <ButtonLink
                                className={styles.btn}
                                type="outlined"
                                path={AppRoutesEnum.SIGNUP}
                            >
                                {t("main.welcome.header.sign-up")}
                            </ButtonLink>
                        </div>
                    </>
                )}
            </header>
        </>
    );
};

export default InfoHeader;

import React, {
    FC, useRef, useState, useContext,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Popup from "@/components/Popup/Popup";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import { RoutePath } from "@/routes/model/config/RouterConfig";

import { logout } from "@/store/reducers/loginSlice";

import styles from "./InfoHeader.module.scss";
import { LocaleContext, getMainPageUrl, getProfileInfoPageUrl } from "@/routes";

const InfoHeader: FC = () => {
    const { t } = useTranslation();

    const { locale } = useContext(LocaleContext);

    const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);

    const { token } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const communityRef = useRef(null);

    const handleClickOutside = () => {
        setLinkIsOpen(false);
    };

    console.log(getMainPageUrl(locale))

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
                    onClick={() => setLinkIsOpen(!linkIsOpen)}
                >
                    <p>{t("main.welcome.header.community.title")}</p>
                    <Arrow isOpen={linkIsOpen} />
                    <Popup isOpen={linkIsOpen} className={styles.popup}>
                        <Link to={getMainPageUrl(locale)}>
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
                            <Link to={getProfileInfoPageUrl(locale)}>
                                Личный кабинет
                            </Link>
                        </div>
                        <div className={styles.link}>
                            <Button
                                onClick={() => handleLogout()}
                                className={styles.btn}
                                variant={Variant.PRIMARY}
                            >
                                {t("main.welcome.header.exit")}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.link}>
                            <LocaleLink replace to={RoutePath.sign_in}>
                                {t("main.welcome.header.sign-in")}
                            </LocaleLink>
                        </div>
                        <div className={styles.link}>
                            <ButtonLink
                                className={styles.btn}
                                type="outlined"
                                path={RoutePath.sign_up}
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

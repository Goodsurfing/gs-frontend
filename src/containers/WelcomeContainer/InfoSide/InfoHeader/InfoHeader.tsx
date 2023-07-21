import {
    useRef, useState, memo, useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import {
    getMainPageUrl, getProfileInfoPageUrl, getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";

import LocaleLink from "@/components/LocaleLink/LocaleLink";
import MobileHeader from "@/components/MobileHeader/MobileHeader";
import Popup from "@/components/Popup/Popup";

import { getUserAuthData, userActions } from "@/entities/User";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import { useLocale } from "@/app/providers/LocaleProvider";

import styles from "./InfoHeader.module.scss";

const InfoHeader = memo(() => {
    const { t } = useTranslation();

    const { locale } = useLocale();

    const navigate = useNavigate();

    const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);

    const isAuth = useAppSelector(getUserAuthData);

    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, locale, navigate]);

    const communityRef = useRef(null);

    const handleClickOutside = useCallback(() => {
        setLinkIsOpen(false);
    }, []);

    useOnClickOutside(communityRef, handleClickOutside);

    return (
        <>
            <div className={styles.mobile__header__wrapper}>
                <MobileHeader />
            </div>
            <header className={styles.header}>
                <ChangeLanguage />
                <div className={styles.link}>
                    <Link to={getMainPageUrl(locale)}>{t("main.welcome.header.how-it-work")}</Link>
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
                        <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.video")}
                        </Link>
                        <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.experts")}
                        </Link>
                        <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.ambassadors")}
                        </Link>
                        <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.courses")}
                        </Link>
                        <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.clubs")}
                        </Link>
                        <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.journal")}
                        </Link>
                    </Popup>
                </div>
                {isAuth ? (
                    <>
                        <div className={styles.link}>
                            <Link to={getProfileInfoPageUrl(locale)}>
                                Личный кабинет
                            </Link>
                        </div>
                        <div className={styles.link}>
                            <Button
                                onClick={handleLogout}
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
                            <LocaleLink to={getSignInPageUrl(locale)}>
                                {t("main.welcome.header.sign-in")}
                            </LocaleLink>
                        </div>
                        <div className={styles.link}>
                            <ButtonLink
                                className={styles.btn}
                                type="outlined"
                                path={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.sign-up")}
                            </ButtonLink>
                        </div>
                    </>
                )}
            </header>
        </>
    );
});

export default InfoHeader;

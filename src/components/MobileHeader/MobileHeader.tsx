import cn from "classnames";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import { useAppSelector } from "@/shared/hooks/redux";

import mobileLogotype from "@/shared/assets/icons/mobile-header-logo.svg";

import styles from "./MobileHeader.module.scss";
import {
    getMainPageUrl, getSignInPageUrl, getSignUpPageUrl,
} from "@/shared/config/routes/AppUrls";

import { useLocale } from "@/app/providers/LocaleProvider";

const MobileHeader: FC = () => {
    const { t } = useTranslation();
    const { token } = useAppSelector((state) => state.login);
    const { locale } = useLocale();
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

    return (
        <>
            <header className={styles.header}>
                <Link to={getMainPageUrl(locale)}>
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
                    onClick={() => setMenuIsOpen(!menuIsOpen)}
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
                    <Link to={getMainPageUrl(locale)}>{t("main.welcome.header.how-it-work")}</Link>
                </div>
                <div className={styles.link}>
                    <Link to={getMainPageUrl(locale)}>
                        {t("main.welcome.header.community.title")}
                    </Link>
                </div>
                <div className={styles.link}>
                    {token ? (
                        <Link to={getMainPageUrl(locale)}>Категории</Link>
                    ) : (
                        <Link to={getSignInPageUrl(locale)}>
                            {t("main.welcome.header.sign-in")}
                        </Link>
                    )}
                </div>
                <div className={styles.link}>
                    <Link to={getSignUpPageUrl(locale)}>
                        {t("main.welcome.header.sign-up")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MobileHeader;

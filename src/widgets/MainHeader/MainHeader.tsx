import { Button } from "@mui/material";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import MobileHeader from "@/widgets/MobileHeader/ui/MobileHeader/MobileHeader";

import heartIcon from "@/shared/assets/icons/heart-icon.svg";
import logotypeIcon from "@/shared/assets/icons/logo-black.svg";
import messagesIcon from "@/shared/assets/icons/message_icon.svg";
import { getMainPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { getUserAuthData } from "@/entities/User";

import { MainHeaderNav } from "./MainHeaderNav/MainHeaderNav";
import MainHeaderProfile from "./MainHeaderProfile/MainHeaderProfile";
import styles from "./MainHeader.module.scss";
import { useAppSelector } from "@/shared/hooks/redux";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

const MainHeader: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();

    const isAuth = useAppSelector(getUserAuthData);

    return (
        <>
            <header className={styles.header}>
                <div className={styles.left}>
                    <LocaleLink
                        to={getMainPageUrl(locale)}
                        className={styles.logo}
                    >
                        <img src={logotypeIcon} alt="GoodSurfing" />
                    </LocaleLink>
                    <ChangeLanguage />
                </div>
                <MainHeaderNav />
                <div className={styles.right}>
                    {isAuth ? (
                        <>
                            <div className={styles.icons}>
                                <LocaleLink
                                    to={getMainPageUrl(locale)}
                                    className={styles.icon}
                                >
                                    <img src={heartIcon} alt="Favorites" />
                                </LocaleLink>
                                <LocaleLink
                                    to={getMainPageUrl(locale)}
                                    className={styles.icon}
                                >
                                    <img src={messagesIcon} alt="Messages" />
                                </LocaleLink>
                            </div>
                            <MainHeaderProfile />
                        </>
                    ) : (
                        <ButtonLink
                            className={styles.btn}
                            type="outlined"
                            path={getSignInPageUrl(locale)}
                        >
                            {t("main.welcome.header.sign-in")}
                        </ButtonLink>
                    )}
                    <Button className={styles.membership}>Членство</Button>
                </div>
            </header>
            <div className={styles.mobile}>
                <MobileHeader />
            </div>
        </>
    );
};

export default React.memo(MainHeader);

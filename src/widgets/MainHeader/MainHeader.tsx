import { Button } from "@mui/material";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { ReactSVG } from "react-svg";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import MobileHeader from "@/widgets/MobileHeader/ui/MobileHeader/MobileHeader";

import { useUser } from "@/entities/Profile";
import { getUserAuthData } from "@/entities/User";

import heartIcon from "@/shared/assets/icons/heart-icon.svg";
import logotypeIcon from "@/shared/assets/icons/logo-black.svg";
import messagesIcon from "@/shared/assets/icons/message_icon.svg";
import {
    getMainPageUrl,
    getMembershipPageUrl,
    getMessengerPageUrl,
    getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppSelector } from "@/shared/hooks/redux";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./MainHeader.module.scss";
import { MainHeaderNav } from "./MainHeaderNav/MainHeaderNav";
import MainHeaderProfile from "./MainHeaderProfile/MainHeaderProfile";

const MainHeader: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();

    const { profile, isLoading } = useUser();

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
                                    <ReactSVG src={heartIcon} />
                                </LocaleLink>
                                <LocaleLink
                                    to={getMessengerPageUrl(locale)}
                                    className={styles.icon}
                                >
                                    <ReactSVG src={messagesIcon} />
                                </LocaleLink>
                            </div>
                            <MainHeaderProfile
                                profileData={profile}
                                isLoading={isLoading}
                            />
                            <LocaleLink to={getMembershipPageUrl(locale)}>
                                <Button className={styles.membership}>
                                    Членство
                                </Button>
                            </LocaleLink>
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
                </div>
            </header>
            <div className={styles.mobile}>
                <MobileHeader />
            </div>
        </>
    );
};

export default React.memo(MainHeader);

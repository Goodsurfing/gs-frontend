import { Button } from "@mui/material";
import React, { FC, useCallback } from "react";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import MobileHeader from "@/widgets/MobileHeader/ui/MobileHeader/MobileHeader";

import heartIcon from "@/shared/assets/icons/heart-icon.svg";
import logotypeIcon from "@/shared/assets/icons/logo-black.svg";
import messagesIcon from "@/shared/assets/icons/message_icon.svg";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { getUserAuthData, userActions } from "@/entities/User";

import { MainHeaderNav } from "./MainHeaderNav/MainHeaderNav";
import MainHeaderProfile from "./MainHeaderProfile/MainHeaderProfile";
import styles from "./MainHeader.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";

const MainHeader: FC = () => {
    const { locale } = useLocale();

    const isAuth = useAppSelector(getUserAuthData);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, locale, navigate]);

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

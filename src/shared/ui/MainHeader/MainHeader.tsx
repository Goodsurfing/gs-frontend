import React, { FC } from "react";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";
import MobileHeader from "@/components/MobileHeader/MobileHeader";

import heartIcon from "@/shared/assets/icons/heart-icon.svg";
import logotypeIcon from "@/shared/assets/icons/logo-black.svg";
import messagesIcon from "@/shared/assets/icons/message_icon.svg";

import styles from "./MainHeader.module.scss";
import MainHeaderProfile from "./MainHeaderProfile/MainHeaderProfile";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

const MainHeader: FC = () => {
    const { locale } = useLocale();
    return (
        <>
            <header className={styles.header}>
                <div className={styles.left}>
                    <LocaleLink to={getMainPageUrl(locale)} className={styles.logo}>
                        <img src={logotypeIcon} alt="GoodSurfing" />
                    </LocaleLink>
                    <ChangeLanguage />
                </div>
                <div className={styles.right}>
                    <div className={styles.icons}>
                        <LocaleLink to={getMainPageUrl(locale)} className={styles.icon}>
                            <img src={heartIcon} alt="Favorites" />
                        </LocaleLink>
                        <LocaleLink to={getMainPageUrl(locale)} className={styles.icon}>
                            <img src={messagesIcon} alt="Messages" />
                        </LocaleLink>
                    </div>
                    <MainHeaderProfile />
                </div>
            </header>
            <div className={styles.mobile}>
                <MobileHeader />
            </div>
        </>
    );
};

export default React.memo(MainHeader);

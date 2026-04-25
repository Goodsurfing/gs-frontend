import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import MobileHeader from "@/widgets/MobileHeader/ui/MobileHeader/MobileHeader";

import logotypeIcon from "@/shared/assets/icons/logo-black.svg";
import {
    getMainPageUrl,
    getMessengerPageUrl,
    getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { MainHeaderNav } from "./MainHeaderNav/MainHeaderNav";
import MainHeaderProfile from "./MainHeaderProfile/MainHeaderProfile";
import { MessangerInfo } from "./MessangerInfo/MessangerInfo";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { BannerMarketingType, useGetBannerMarketingQuery } from "@/entities/Admin";
import styles from "./MainHeader.module.scss";

const MainHeader: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { myProfile, profileIsLoading, isAuth } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    const { data } = useGetBannerMarketingQuery(
        { type: BannerMarketingType.UNDER_HEADER_ALL_PAGES },
    );

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <div className={styles.spacer} aria-hidden="true" />
            <div className={cn(styles.wrapper, { [styles.scrolled]: scrolled })}>
                <header className={styles.header}>
                    <div className={styles.left}>
                        <LocaleLink
                            to={getMainPageUrl(locale)}
                            className={styles.logo}
                        >
                            <img src={logotypeIcon} alt="GoodSurfing" />
                        </LocaleLink>
                    </div>
                    <div className={styles.nav}>
                        <MainHeaderNav />
                    </div>
                    <div className={styles.right}>
                        <ChangeLanguage localeApi={myProfile?.locale} profileData={myProfile} />
                        {(isAuth && myProfile) ? (
                            <>
                                <div className={styles.icons}>
                                    <LocaleLink
                                        to={getMessengerPageUrl(locale)}
                                        className={styles.icon}
                                    >
                                        <MessangerInfo />
                                    </LocaleLink>
                                </div>
                                <MainHeaderProfile
                                    profileData={myProfile}
                                    isLoading={profileIsLoading}
                                />
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
                {data && (
                    <div className={styles.banner}>
                        <p>{data.description}</p>
                        <ButtonLink
                            className={styles.bannerBtn}
                            path={data.url}
                            type="outlined"
                        >
                            Подробнее
                        </ButtonLink>
                    </div>
                )}
            </div>
        </>
    );
};

export default React.memo(MainHeader);

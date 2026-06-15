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
    getMembershipPageUrl,
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

type Variant = "floating" | "static";

interface MainHeaderProps {
    variant?: Variant;
}

const MainHeader: FC<MainHeaderProps> = ({ variant = "floating" }) => {
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
        <div className={cn(styles.wrapper, styles[variant], { [styles.scrolled]: scrolled })}>
            {data && (
                <a
                    href={data.url}
                    className={styles.banner}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className={styles.bannerText}>{data.description}</span>
                    <span className={styles.bannerCta}>Подробнее →</span>
                </a>
            )}
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
                    <LocaleLink
                        to={getMembershipPageUrl(locale)}
                        className={styles.membershipCta}
                    >
                        {t("main.welcome.header.membership", "Членство")}
                    </LocaleLink>
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
        </div>
    );
};

export default React.memo(MainHeader);

import { Button } from "@mui/material";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
// import { ReactSVG } from "react-svg";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import MobileHeader from "@/widgets/MobileHeader/ui/MobileHeader/MobileHeader";

// import heartIcon from "@/shared/assets/icons/heart-icon.svg";
import logotypeIcon from "@/shared/assets/icons/logo-black.svg";
import {
    // getFavoriteOffersPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getMessengerPageUrl,
    getSignInPageUrl,
} from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { MainHeaderNav } from "./MainHeaderNav/MainHeaderNav";
import MainHeaderProfile from "./MainHeaderProfile/MainHeaderProfile";
import { MessangerInfo } from "./MessangerInfo/MessangerInfo";
import styles from "./MainHeader.module.scss";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetMembershipStatusQuery } from "@/store/api/paymentApi";

const MainHeader: FC = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { myProfile, profileIsLoading, isAuth } = useAuth();
    
    const { data: membershipStatus } = useGetMembershipStatusQuery(undefined, {
        skip: !isAuth,
    });

    const hasMembership = membershipStatus?.hasMembership ?? false;

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
                    <ChangeLanguage localeApi={myProfile?.locale} profileData={myProfile} />
                </div>
                <MainHeaderNav />
                <div className={styles.right}>
                    {(isAuth && myProfile) ? (
                        <>
                            <div className={styles.icons}>
                                {/* <LocaleLink
                                    to={getFavoriteOffersPageUrl(locale)}
                                    className={styles.icon}
                                >
                                    <ReactSVG src={heartIcon} />
                                </LocaleLink> */}
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
                            <LocaleLink
                                className={styles.membershipWrapper}
                                to={getMembershipPageUrl(locale)}
                            >
                                <Button 
                                    className={styles.membership}
                                    disabled={hasMembership}
                                >
                                    {hasMembership ? "Членство получено" : "Членство"}
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

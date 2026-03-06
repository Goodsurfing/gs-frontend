import {
    memo, useCallback, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Popup from "@/components/Popup/Popup";

import { useLocale } from "@/app/providers/LocaleProvider";

import { userActions } from "@/entities/User";

import {
    getAboutProjectPageUrl,
    getAcademyMainPageUrl,
    getAmbassadorsPageUrl,
    getBlogPageUrl,
    getDonationsMapPageUrl,
    getFindJobPageUrl,
    getJournalsPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getNPOPageUrl,
    getNewsPageUrl,
    getOurTeamPageUrl,
    getPrivacyPolicyPageUrl,
    getProfileInfoPageUrl,
    getRulesPageUrl,
    getSignInPageUrl,
    getVideoPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppDispatch } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Button from "@/shared/ui/Button/Button";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { InfoMobileHeader } from "../InfoMobileHeader/ui/InfoMobileHeader/InfoMobileHeader";
import styles from "./InfoHeader.module.scss";

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
    isDonationOpened: boolean;
}

type ButtonNav = "COMMUNITY" | "ABOUT" | "DONATION";

const InfoHeader = memo(() => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { isAuth } = useAuth();

    const communityRef = useRef(null);
    const aboutProjectRef = useRef(null);
    const donationRef = useRef(null);

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCommunityOpened: false,
        isAboutProjectOpened: false,
        isDonationOpened: false,
    });

    const dispatch = useAppDispatch();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, locale, navigate]);

    useOnClickOutside(
        communityRef,
        () => setDropdownOpened((prev) => ({ ...prev, isCommunityOpened: false })),
    );
    useOnClickOutside(
        aboutProjectRef,
        () => setDropdownOpened((prev) => ({ ...prev, isAboutProjectOpened: false })),
    );
    useOnClickOutside(
        donationRef,
        () => setDropdownOpened((prev) => ({ ...prev, isDonationOpened: false })),
    );

    const handleOpenDropdown = (type: ButtonNav) => {
        setDropdownOpened((prev) => {
            switch (type) {
                case "COMMUNITY":
                    return {
                        ...prev,
                        isCommunityOpened: !prev.isCommunityOpened,
                    };
                case "ABOUT":
                    return {
                        ...prev,
                        isAboutProjectOpened: !prev.isAboutProjectOpened,
                    };
                case "DONATION":
                    return {
                        ...prev,
                        isDonationOpened: !prev.isDonationOpened,
                    };
                default:
                    return prev;
            }
        });
    };

    return (
        <>
            <div className={styles.mobile__header__wrapper}>
                <InfoMobileHeader />
            </div>
            <header className={styles.header}>
                {/* <ChangeLanguage localeApi={myProfile?.locale} profileData={myProfile} /> */}
                <div className={styles.left}>
                    <div
                        ref={communityRef}
                        className={styles.link}
                        onClick={() => handleOpenDropdown("COMMUNITY")}
                    >
                        <p>{t("main.welcome.header.community.title")}</p>
                        <Arrow
                            className={styles.arrow}
                            classNameOpen={styles.arrowOpen}
                            isOpen={dropdownOpened.isCommunityOpened}
                        />
                        <Popup isOpen={dropdownOpened.isCommunityOpened} className={styles.popup}>
                            <Link to={getBlogPageUrl(locale)}>
                                {t("main.welcome.header.community.blog")}
                            </Link>
                            <Link to={getVideoPageUrl(locale)}>
                                {t("main.welcome.header.community.video")}
                            </Link>
                            {/* <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.experts")}
                        </Link> */}
                            <Link to={getAmbassadorsPageUrl(locale)}>
                                {t("main.welcome.header.community.ambassadors")}
                            </Link>
                            <Link to={getAcademyMainPageUrl(locale)}>
                                {t("main.welcome.header.community.courses")}
                            </Link>
                            <Link to={getJournalsPageUrl(locale)}>
                                {t("main.welcome.header.community.journal")}
                            </Link>
                        </Popup>
                    </div>
                    <div
                        ref={donationRef}
                        className={styles.link}
                        onClick={() => handleOpenDropdown("DONATION")}
                    >
                        <p>{t("main.welcome.header.donation.title")}</p>
                        <Arrow
                            className={styles.arrow}
                            classNameOpen={styles.arrowOpen}
                            isOpen={dropdownOpened.isDonationOpened}
                        />
                        <Popup
                            className={styles.popup}
                            isOpen={dropdownOpened.isDonationOpened}
                        >
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.donation.support-goodsurfing")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getDonationsMapPageUrl(locale)}
                            >
                                {t("main.welcome.header.donation.support-other-projects")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.donation.public-reports")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.donation.rating-donations")}
                            </Link>
                        </Popup>
                    </div>
                    <div
                        ref={aboutProjectRef}
                        className={styles.link}
                        onClick={() => handleOpenDropdown("ABOUT")}
                    >
                        <p>{t("main.welcome.header.about-project.title")}</p>
                        <Arrow
                            className={styles.arrow}
                            classNameOpen={styles.arrowOpen}
                            isOpen={dropdownOpened.isAboutProjectOpened}
                        />
                        <Popup
                            isOpen={dropdownOpened.isAboutProjectOpened}
                            className={styles.popup}
                        >
                            <Link to={getNewsPageUrl(locale)}>
                                {t("main.welcome.header.about-project.news")}
                            </Link>
                            <Link to={getAboutProjectPageUrl(locale)}>
                                {t("main.welcome.header.about-project.about-goodsurfing")}
                            </Link>
                            <Link to={getNPOPageUrl(locale)}>
                                {t("main.welcome.header.about-project.about-npo")}
                            </Link>
                            <Link to={getOurTeamPageUrl(locale)}>
                                {t("main.welcome.header.about-project.our-team")}
                            </Link>
                            <Link to={getMembershipPageUrl(locale)}>
                                {t("main.welcome.header.about-project.how-it-works")}
                            </Link>
                            <Link to={getRulesPageUrl(locale)}>
                                {t("main.welcome.header.about-project.rules")}
                            </Link>
                            <Link to={getPrivacyPolicyPageUrl(locale)}>
                                {t("main.welcome.header.about-project.privacy-policy")}
                            </Link>
                            <Link to={getFindJobPageUrl(locale)}>
                                {t("main.welcome.header.about-project.find-job")}
                            </Link>
                        </Popup>
                    </div>
                    {isAuth && (
                        <div className={styles.link}>
                            <Link to={getProfileInfoPageUrl(locale)}>
                                {t("main.welcome.header.profile")}
                            </Link>
                        </div>
                    )}
                </div>

                {isAuth ? (
                    <div className={styles.link}>
                        <Button
                            onClick={handleLogout}
                            className={styles.btn}
                            variant="FILL"
                            color="WHITE"
                            size="MEDIUM"
                        >
                            {t("main.welcome.header.exit")}
                        </Button>
                    </div>
                ) : (
                    <div className={styles.link}>
                        <ButtonLink
                            className={styles.btn}
                            type="white-outlined"
                            path={getSignInPageUrl(locale)}
                        >
                            {t("main.welcome.header.sign-in")}
                        </ButtonLink>
                    </div>
                )}
            </header>
        </>
    );
});

export default InfoHeader;

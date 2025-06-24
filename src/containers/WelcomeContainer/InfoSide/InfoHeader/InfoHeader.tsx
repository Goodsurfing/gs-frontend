import {
    memo, useCallback, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Popup from "@/components/Popup/Popup";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import MobileHeader from "@/widgets/MobileHeader/ui/MobileHeader/MobileHeader";

import { getUserAuthData, userActions } from "@/entities/User";

import {
    getAboutProjectPageUrl,
    // getAcademyMainPageUrl,
    getAmbassadorsPageUrl,
    // getBlogPageUrl,
    getFindJobPageUrl,
    // getJournalsPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getNPOPageUrl,
    // getNewsPageUrl,
    getOurTeamPageUrl,
    getPrivacyPolicyPageUrl,
    getProfileInfoPageUrl,
    getRulesPageUrl,
    getSignInPageUrl,
    // getVideoPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Button from "@/shared/ui/Button/Button";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./InfoHeader.module.scss";
import { useAuth } from "@/routes/model/guards/AuthProvider";

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
}

type ButtonNav = "COMMUNITY" | "ABOUT";

const InfoHeader = memo(() => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { myProfile } = useAuth();

    const communityRef = useRef(null);
    const aboutProjectRef = useRef(null);

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCommunityOpened: false,
        isAboutProjectOpened: false,
    });

    const isAuth = useAppSelector(getUserAuthData);

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
                default:
                    return prev;
            }
        });
    };

    return (
        <>
            <div className={styles.mobile__header__wrapper}>
                <MobileHeader />
            </div>
            <header className={styles.header}>
                <ChangeLanguage localeApi={myProfile?.locale} profileId={myProfile?.id} />
                <div
                    ref={communityRef}
                    className={styles.link}
                    onClick={() => handleOpenDropdown("COMMUNITY")}
                >
                    <p>{t("main.welcome.header.community.title")}</p>
                    <Arrow isOpen={dropdownOpened.isCommunityOpened} />
                    <Popup isOpen={dropdownOpened.isCommunityOpened} className={styles.popup}>
                        <Link to="https://community.goodsurfing.org/category/post/">
                            {t("main.welcome.header.community.blog")}
                        </Link>
                        <Link to="https://community.goodsurfing.org/filmy/">
                            {t("main.welcome.header.community.video")}
                        </Link>
                        {/* <Link to={getMainPageUrl(locale)}>
                            {t("main.welcome.header.community.experts")}
                        </Link> */}
                        <Link to={getAmbassadorsPageUrl(locale)}>
                            {t("main.welcome.header.community.ambassadors")}
                        </Link>
                        <Link to="https://community.goodsurfing.org/courses/">
                            {t("main.welcome.header.community.courses")}
                        </Link>
                        {/* <Link to={getJournalsPageUrl(locale)}>
                            {t("main.welcome.header.community.journal")}
                        </Link> */}
                    </Popup>
                </div>
                <div
                    ref={aboutProjectRef}
                    className={styles.link}
                    onClick={() => handleOpenDropdown("ABOUT")}
                >
                    <p>{t("main.welcome.header.about-project.title")}</p>
                    <Arrow isOpen={dropdownOpened.isAboutProjectOpened} />
                    <Popup isOpen={dropdownOpened.isAboutProjectOpened} className={styles.popup}>
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
                        <Link to="https://community.goodsurfing.org/">
                            {t("main.welcome.header.about-project.news")}
                        </Link>
                        <Link to={getAboutProjectPageUrl(locale)}>
                            {t("main.welcome.header.about-project.about-goodsurfing")}
                        </Link>
                        <Link to={getFindJobPageUrl(locale)}>
                            {t("main.welcome.header.about-project.find-job")}
                        </Link>
                    </Popup>
                </div>

                {isAuth ? (
                    <>
                        <div className={styles.link}>
                            <Link to={getProfileInfoPageUrl(locale)}>
                                {t("main.welcome.header.profile")}
                            </Link>
                        </div>
                        <div className={styles.link}>
                            <Button
                                onClick={handleLogout}
                                className={styles.btn}
                                variant="FILL"
                                color="BLUE"
                                size="MEDIUM"
                            >
                                {t("main.welcome.header.exit")}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className={styles.link}>
                        <ButtonLink
                            className={styles.btn}
                            type="outlined"
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

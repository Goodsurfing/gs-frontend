import { Button } from "@mui/material";
import cn from "classnames";
import React, {
    FC, useCallback, useReducer, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import { getUserAuthData, userActions } from "@/entities/User";

import mobileLogotype from "@/shared/assets/icons/mobile-header-logo.svg";
import {
    getAboutProjectPageUrl,
    getAcademyMainPageUrl,
    getAmbassadorsPageUrl,
    getBlogPageUrl,
    getFindJobPageUrl,
    getHostDashboardPageUrl,
    getJournalsPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getMessengerPageUrl,
    getNPOPageUrl,
    getNewsPageUrl,
    getOffersMapPageUrl,
    getOurTeamPageUrl,
    getPrivacyPolicyPageUrl,
    getProfileInfoPageUrl,
    getRulesPageUrl,
    getSignInPageUrl,
    getVideoPageUrl,
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";

import { MobileSelect } from "../MobileSelect/MobileSelect";
import styles from "./MobileHeader.module.scss";
import {
    ButtonNav,
    initialState,
    toggleDropdownReducer,
} from "./lib/mobileHeaderUtils";

const MobileHeader: FC = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const appDispatch = useAppDispatch();

    const authData = useAppSelector(getUserAuthData);
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [dropdownOpened, dispatch] = useReducer(
        toggleDropdownReducer,
        initialState,
    );

    const handleOpenDropdown = (type: ButtonNav) => {
        dispatch({ type });
    };

    const handleOpenMenu = useCallback(
        () => setMenuIsOpen(!menuIsOpen),
        [menuIsOpen],
    );

    const handleLogout = useCallback(() => {
        appDispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [appDispatch, locale, navigate]);

    return (
        <>
            <header className={styles.header}>
                <Link to={getMainPageUrl(locale)}>
                    <img
                        src={mobileLogotype}
                        alt="GoodSurfing"
                        className={cn(styles.logo, {
                            [styles.logoOpen]: menuIsOpen,
                        })}
                    />
                </Link>

                <ChangeLanguage
                    className={cn({ [styles.changeLanguageOpen]: menuIsOpen })}
                />
                <div
                    className={cn(styles.burger, {
                        [styles.open]: menuIsOpen,
                    })}
                    onClick={handleOpenMenu}
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
                <div className={styles.container} />
                <Button
                    onClick={() => navigate(getOffersMapPageUrl(locale))}
                    className={styles.button}
                >
                    {t("main.welcome.header.offers.title")}
                </Button>
                {/* <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    className={styles.select}
                    style={{ backgroundColor: "#ecf1f4" }}
                    isOpen={dropdownOpened.isOffersOpened}
                    title={t("main.welcome.header.offers.title")}
                    onClick={() => handleOpenDropdown("OFFERS")}
                >
                    <div className={styles.offersContainer}>
                        <div className={styles.famousContainer}>
                            <div className={styles.title}>
                                {t("main.welcome.header.offers.popular-places")}
                            </div>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.latin-america")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.europe")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.asia")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.africa")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.france")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.germany")}
                            </Link>
                        </div>
                        <div className={styles.acrossRussiaContainer}>
                            <div className={styles.title}>
                                {t("main.welcome.header.offers.across-russia")}
                            </div>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.altai")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.kamchatka")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.crimea")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.caucasus")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.ural")}
                            </Link>
                            <Link
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.baikal")}
                            </Link>
                        </div>
                    </div>
                    <Link
                        className={styles.viewAll}
                        to={getOffersMapPageUrl(locale)}
                    >
                        {t("main.welcome.header.offers.view-all")}
                    </Link>
                </MobileSelect> */}
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isCommunityOpened}
                    title={t("main.welcome.header.community.title")}
                    onClick={() => handleOpenDropdown("COMMUNITY")}
                >
                    <Link
                        className={styles.dropdownLink}
                        to={getBlogPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.blog")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getVideoPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.video")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getAmbassadorsPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.ambassadors")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getAcademyMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.courses")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getJournalsPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.journal")}
                    </Link>
                </MobileSelect>
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isAboutProjectOpened}
                    title={t("main.welcome.header.about-project.title")}
                    onClick={() => handleOpenDropdown("ABOUT")}
                >
                    <Link
                        className={styles.dropdownLink}
                        to={getNewsPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.news")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getAboutProjectPageUrl(locale)}
                    >
                        {t(
                            "main.welcome.header.about-project.about-goodsurfing",
                        )}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getNPOPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.about-npo")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getOurTeamPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.our-team")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMembershipPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.how-it-works")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getRulesPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.rules")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getPrivacyPolicyPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.privacy-policy")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getFindJobPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.find-job")}
                    </Link>
                </MobileSelect>
                {authData ? (
                    <>
                        <Button
                            onClick={() => navigate(getProfileInfoPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.my-page")}
                        </Button>
                        {/* <Button
                            onClick={() => navigate(getFavoriteOffersPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.favorite")}
                        </Button> */}
                        <Button
                            onClick={() => navigate(getMessengerPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.messages")}
                        </Button>
                        <Button
                            onClick={() => navigate(getHostDashboardPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.host-dashboard")}
                        </Button>
                        <Button
                            onClick={() => navigate(getVolunteerDashboardPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.volunteer-dashboard")}
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className={styles.button}
                        >
                            {t("main.welcome.header.exit")}
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={() => navigate(getSignInPageUrl(locale))}
                        className={styles.button}
                    >
                        {t("main.welcome.header.sign-in")}
                    </Button>
                )}
            </div>
        </>
    );
};

export default MobileHeader;

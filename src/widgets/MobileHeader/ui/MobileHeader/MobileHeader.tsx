import { Button } from "@mui/material";
import cn from "classnames";
import React, {
    FC, useCallback, useReducer, useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { NavMenuLink } from "@/shared/ui/NavMenuLink/NavMenuLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import { getUserAuthData, userActions } from "@/entities/User";

import mobileLogotype from "@/shared/assets/icons/mobile-header-logo.svg";
import {
    getAboutProjectPageUrl,
    getAcademyMainPageUrl,
    getAmbassadorsPageUrl,
    getBecomeHostPageUrl,
    getBlogPageUrl,
    getDonationRating,
    getDonationsMapPageUrl,
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
    getProfileInfoPageUrl,
    getSignInPageUrl,
    getVideoPageUrl,
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useGetCurrentAllMembershipsQuery } from "@/store/api/membershipApi";
import { TARIFF_CODE, TARIFF_FALLBACK_PRICE_RUB } from "@/shared/constants/membership";
import { formatDate } from "@/shared/lib/formatDate";

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
    // GS-198: срок показываем по обычному членству, не по Международному клубу.
    const { data: memberships } = useGetCurrentAllMembershipsQuery(undefined, { skip: !authData });
    const membership = memberships?.find((item) => item.isActive && item.tariff?.category === "REGULAR");
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
                <button
                    type="button"
                    className={cn(styles.burger, {
                        [styles.open]: menuIsOpen,
                    })}
                    onClick={handleOpenMenu}
                    aria-label={t("main.welcome.header.menu")}
                    aria-expanded={menuIsOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
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
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.latin-america")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.europe")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.asia")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.africa")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.france")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.germany")}
                            </NavMenuLink>
                        </div>
                        <div className={styles.acrossRussiaContainer}>
                            <div className={styles.title}>
                                {t("main.welcome.header.offers.across-russia")}
                            </div>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.altai")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.kamchatka")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.crimea")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.caucasus")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.ural")}
                            </NavMenuLink>
                            <NavMenuLink
                                className={styles.dropdownLink}
                                to={getMainPageUrl(locale)}
                            >
                                {t("main.welcome.header.offers.baikal")}
                            </NavMenuLink>
                        </div>
                    </div>
                    <NavMenuLink
                        className={styles.viewAll}
                        to={getOffersMapPageUrl(locale)}
                    >
                        {t("main.welcome.header.offers.view-all")}
                    </NavMenuLink>
                </MobileSelect> */}
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isCommunityOpened}
                    title={t("main.welcome.header.community.title")}
                    onClick={() => handleOpenDropdown("COMMUNITY")}
                >
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getBlogPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.blog")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getVideoPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.video")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getAmbassadorsPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.ambassadors")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getAcademyMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.courses")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getJournalsPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.journal")}
                    </NavMenuLink>
                </MobileSelect>
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isSupportOpened}
                    title={t("main.welcome.header.donation.title")}
                    onClick={() => handleOpenDropdown("SUPPORT")}
                >
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getMembershipPageUrl(locale)}
                    >
                        {t("main.welcome.header.donation.support-goodsurfing")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getDonationsMapPageUrl(locale)}
                    >
                        {t("main.welcome.header.donation.support-other-projects")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getNPOPageUrl(locale)}
                    >
                        {t("main.welcome.header.donation.public-reports")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getDonationRating(locale)}
                    >
                        {t("main.welcome.header.donation.rating-donations")}
                    </NavMenuLink>
                </MobileSelect>
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isAboutProjectOpened}
                    title={t("main.welcome.header.about-project.title")}
                    onClick={() => handleOpenDropdown("ABOUT")}
                >
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getNewsPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.news")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getAboutProjectPageUrl(locale)}
                    >
                        {t(
                            "main.welcome.header.about-project.about-goodsurfing",
                        )}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getNPOPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.about-npo")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getOurTeamPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.our-team")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getMembershipPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.how-it-works")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.dropdownLink}
                        to={getFindJobPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.find-job")}
                    </NavMenuLink>
                </MobileSelect>
                <Button
                    onClick={() => navigate(getBecomeHostPageUrl(locale))}
                    className={styles.button}
                >
                    {t("main.welcome.header.for-organizers.become-a-host")}
                </Button>
                <Button
                    href="https://expedition.goodsurfing.org/"
                    className={styles.button}
                >
                    {t("main.welcome.header.expeditions", "Экспедиции")}
                </Button>
                <Button
                    href="https://international.goodsurfing.org/"
                    className={styles.button}
                >
                    {t("main.welcome.header.international-volunteering", "Международное волонтёрство")}
                </Button>
                {/* Вместо двух карточек тарифов (GS-149) — одна строка под
                    кнопкой: подробности на странице членства. */}
                <Button
                    onClick={() => navigate(getMembershipPageUrl(locale))}
                    className={styles.buttonMembership}
                >
                    <span className={styles.membershipTitle}>
                        {t("main.welcome.header.membership", "Членство")}
                    </span>
                    <span className={styles.membershipHint}>
                        {membership?.isActive
                            ? t("main.welcome.header.membership-active", {
                                date: formatDate(locale, membership.endDate),
                            })
                            : t("main.welcome.header.membership-from", {
                                price: TARIFF_FALLBACK_PRICE_RUB[TARIFF_CODE.VOLUNTEER],
                            })}
                    </span>
                </Button>
                <div className={styles.divider} />
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

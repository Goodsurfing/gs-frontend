import { IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { NavMenuLink } from "@/shared/ui/NavMenuLink/NavMenuLink";
import Popup from "@/shared/ui/Popup/Popup";

import { useLocale } from "@/app/providers/LocaleProvider";

import searchIcon from "@/shared/assets/icons/search-icon.svg";
import {
    getAboutProjectPageUrl,
    getAcademyMainPageUrl,
    getAmbassadorsPageUrl,
    getBecomeHostPageUrl,
    getBlogPageUrl,
    getDonationRating,
    getDonationsMapPageUrl,
    getFindJobPageUrl,
    getJournalsPageUrl,
    getMembershipPageUrl,
    getNPOPageUrl,
    getNewsPageUrl,
    getOffersMapPageUrl,
    getOurTeamPageUrl,
    getVideoPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";

import styles from "./MainHeaderNav.module.scss";

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
    isOffersOpened: boolean;
    isDonationOpened: boolean;
}

type ButtonNav = "OFFERS" | "COMMUNITY" | "ABOUT" | "DONATION";

export const MainHeaderNav = () => {
    const { locale } = useLocale();
    const communityRef = useRef(null);
    const aboutProjectRef = useRef(null);
    const offersRef = useRef(null);
    const donationRef = useRef(null);

    const { t } = useTranslation();

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCommunityOpened: false,
        isAboutProjectOpened: false,
        isOffersOpened: false,
        isDonationOpened: false,
    });

    const navigate = useNavigate();

    useOnClickOutside(communityRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isCommunityOpened: false }),
    ));
    useOnClickOutside(aboutProjectRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isAboutProjectOpened: false }),
    ));
    useOnClickOutside(offersRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isOffersOpened: false }),
    ));
    useOnClickOutside(donationRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isDonationOpened: false }),
    ));

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
                case "OFFERS":
                    return {
                        ...prev,
                        isOffersOpened: !prev.isOffersOpened,
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

    const handleNavigateOfferPage = () => {
        navigate(getOffersMapPageUrl(locale));
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.offersWrapper}>
                <IconButton
                    // onClick={() => handleOpenDropdown("OFFERS")}
                    onClick={handleNavigateOfferPage}
                    ref={offersRef}
                    className={styles.btnOffers}
                >
                    {t("main.welcome.header.offers.title")}
                    <ReactSVG className={styles.searchIcn} src={searchIcon} />
                </IconButton>
                {/* <Popup
                    className={styles.popup}
                    isOpen={dropdownOpened.isOffersOpened}
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
                </Popup> */}
            </div>
            <div className={styles.btnCommunity}>
                <div
                    onClick={() => handleOpenDropdown("COMMUNITY")}
                    ref={communityRef}
                    className={styles.btnNav}
                >
                    {t("main.welcome.header.community.title")}
                    <Arrow isOpen={dropdownOpened.isCommunityOpened} />
                </div>
                <Popup
                    className={styles.popup}
                    isOpen={dropdownOpened.isCommunityOpened}
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
                </Popup>
            </div>
            <div className={styles.btnDonation}>
                <div
                    onClick={() => handleOpenDropdown("DONATION")}
                    ref={donationRef}
                    className={styles.btnNav}
                >
                    {t("main.welcome.header.donation.title")}
                    <Arrow isOpen={dropdownOpened.isDonationOpened} />
                </div>
                <Popup
                    className={styles.popup}
                    isOpen={dropdownOpened.isDonationOpened}
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
                </Popup>
            </div>
            <div className={styles.btnAbout}>
                <div
                    onClick={() => handleOpenDropdown("ABOUT")}
                    ref={aboutProjectRef}
                    className={styles.btnNav}
                >
                    {t("main.welcome.header.about-project.title")}
                    <Arrow isOpen={dropdownOpened.isAboutProjectOpened} />
                </div>
                <Popup
                    className={styles.popup}
                    isOpen={dropdownOpened.isAboutProjectOpened}
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
                </Popup>
            </div>
            <div>
                <NavMenuLink className={styles.btnNav} to={getBecomeHostPageUrl(locale)}>
                    {t("main.welcome.header.for-organizers.become-a-host")}
                </NavMenuLink>
            </div>
            <div>
                <NavMenuLink className={styles.btnNav} to="https://expedition.goodsurfing.org/">
                    {t("main.welcome.header.expeditions", "Экспедиции")}
                </NavMenuLink>
            </div>
            <div>
                <NavMenuLink className={styles.btnNav} to="https://international.goodsurfing.org/">
                    {t("main.welcome.header.international-volunteering", "Международное волонтёрство")}
                </NavMenuLink>
            </div>
        </div>
    );
};

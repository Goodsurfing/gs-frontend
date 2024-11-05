import { IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import Popup from "@/components/Popup/Popup";

import { useLocale } from "@/app/providers/LocaleProvider";

import searchIcon from "@/shared/assets/icons/search-icon.svg";
import {
    getAboutProjectPageUrl,
    getAmbassadorsPageUrl,
    getBlogPageUrl,
    getFindJobPageUrl,
    getJournalsPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getNPOPageUrl,
    getNewsPageUrl,
    getOffersMapPageUrl,
    getOurTeamPageUrl,
    getPrivacyPolicyPageUrl,
    getRulesPageUrl,
    getVideoPageUrl,
} from "@/shared/config/routes/AppUrls";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";

import styles from "./MainHeaderNav.module.scss";

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
    isOffersOpened: boolean;
}

type ButtonNav = "OFFERS" | "COMMUNITY" | "ABOUT";

export const MainHeaderNav = () => {
    const { locale } = useLocale();
    const communityRef = useRef(null);
    const aboutProjectRef = useRef(null);
    const offersRef = useRef(null);

    const { t } = useTranslation();

    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCommunityOpened: false,
        isAboutProjectOpened: false,
        isOffersOpened: false,
    });

    useOnClickOutside(communityRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isCommunityOpened: false }),
    ));
    useOnClickOutside(aboutProjectRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isAboutProjectOpened: false }),
    ));
    useOnClickOutside(offersRef, () => setDropdownOpened(
        (prev) => ({ ...prev, isOffersOpened: false }),
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
                default:
                    return prev;
            }
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.offersWrapper}>
                <IconButton
                    onClick={() => handleOpenDropdown("OFFERS")}
                    ref={offersRef}
                    className={styles.btnOffers}
                >
                    {t("main.welcome.header.offers.title")}
                    <ReactSVG className={styles.searchIcn} src={searchIcon} />
                </IconButton>
                <Popup
                    className={styles.popup}
                    isOpen={dropdownOpened.isOffersOpened}
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
                </Popup>
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
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.experts")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getAmbassadorsPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.ambassadors")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.courses")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.clubs")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getJournalsPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.journal")}
                    </Link>
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
                        to={getFindJobPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.find-job")}
                    </Link>
                </Popup>
            </div>
        </div>
    );
};

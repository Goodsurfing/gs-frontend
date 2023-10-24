import cn from "classnames";
import { FC, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import { useAppSelector } from "@/shared/hooks/redux";

import mobileLogotype from "@/shared/assets/icons/mobile-header-logo.svg";

import {
    getMainPageUrl, getSignInPageUrl, getSignUpPageUrl, getProfileInfoPageUrl,
} from "@/shared/config/routes/AppUrls";

import { useLocale } from "@/app/providers/LocaleProvider";
import { MobileSelect } from "../MobileSelect/MobileSelect";
import styles from "./MobileHeader.module.scss";

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
    isOffersOpened: boolean;
}

type ButtonNav = "OFFERS" | "COMMUNITY" | "ABOUT";

const MobileHeader: FC = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();

    const authData = useAppSelector((state) => state.user.authData);
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [dropdownOpened, setDropdownOpened] = useState<DropdownState>({
        isCommunityOpened: false,
        isAboutProjectOpened: false,
        isOffersOpened: false,
    });

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
        <>
            <header className={styles.header}>
                <Link to={getMainPageUrl(locale)}>
                    <img
                        src={mobileLogotype}
                        alt="GoodSurfing"
                        className={styles.logo}
                    />
                </Link>

                <ChangeLanguage />
                <div
                    className={cn(styles.burger, {
                        [styles.open]: menuIsOpen,
                    })}
                    onClick={() => setMenuIsOpen(!menuIsOpen)}
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
                {/* <div className={styles.link}>
                    <Link to={getMainPageUrl(locale)}>{t("main.welcome.header.how-it-work")}</Link>
                </div>
                <div className={styles.link}>
                    <Link to={getMainPageUrl(locale)}>
                        {t("main.welcome.header.community.title")}
                    </Link>
                </div>
                <div className={styles.link}>
                    {authData ? (
                        <Link to={getMainPageUrl(locale)}>Категории</Link>
                    ) : (
                        <Link to={getSignInPageUrl(locale)}>
                            {t("main.welcome.header.sign-in")}
                        </Link>
                    )}
                </div>
                <div className={styles.link}>
                    <Link to={getSignUpPageUrl(locale)}>
                        {t("main.welcome.header.sign-up")}
                    </Link>
                </div> */}

                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isOffersOpened}
                    title="Все вакансии"
                    onClick={() => handleOpenDropdown("OFFERS")}
                    // ref={offersRef}
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
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.offers.view-all")}
                    </Link>
                </MobileSelect>
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isCommunityOpened}
                    title="Сообщество"
                    onClick={() => handleOpenDropdown("COMMUNITY")}
                    // ref={communityRef}
                >
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.blog")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
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
                        to={getMainPageUrl(locale)}
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
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.community.journal")}
                    </Link>
                </MobileSelect>
                <MobileSelect
                    classNameSelectContainer={styles.selectContainer}
                    isOpen={dropdownOpened.isAboutProjectOpened}
                    title="О проекте"
                    onClick={() => handleOpenDropdown("ABOUT")}
                    // ref={aboutProjectRef}
                >
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.about-npo")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.our-team")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.how-it-works")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.rules")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.privacy-policy")}
                    </Link>
                    <Link
                        className={styles.dropdownLink}
                        to={getMainPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.news")}
                    </Link>
                </MobileSelect>
                {
                    authData ? (
                        <>
                            <Button
                                onClick={() => navigate(getProfileInfoPageUrl(locale))}
                                className={styles.button}
                            >
                                {t("main.welcome.header.my-page")}
                            </Button>
                            <Button
                                onClick={() => navigate(getMainPageUrl(locale))}
                                className={styles.button}
                            >
                                {t("main.welcome.header.messages")}
                            </Button>
                            <Button
                                onClick={() => navigate(getProfileInfoPageUrl(locale))}
                                className={styles.button}
                            >
                                {t("main.welcome.header.host-dashboard")}
                            </Button>
                            <Button
                                onClick={() => navigate(getMainPageUrl(locale))}
                                className={styles.button}
                            >
                                {t("main.welcome.header.volunteer-dashboard")}
                            </Button>
                        </>
                    )
                        : (
                            <>
                                <Button
                                    onClick={() => navigate(getSignInPageUrl(locale))}
                                    className={styles.button}
                                >
                                    {t("main.welcome.header.sign-in")}
                                </Button>
                                <Button
                                    onClick={() => navigate(getSignUpPageUrl(locale))}
                                    className={styles.button}
                                >
                                    {t("main.welcome.header.sign-up")}
                                </Button>
                            </>
                        )
                }
            </div>
        </>
    );
};

export default MobileHeader;

import React, {
    useCallback, useReducer, useRef, useState,
} from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button as ButtonMenu } from "@mui/material";
import mobileLogotype from "@/shared/assets/icons/mobile-header-logo.svg";
import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import Button from "@/shared/ui/Button/Button";
import sliderLogo from "@/shared/assets/icons/slider-logo.svg";
import { ButtonNav, initialState, toggleDropdownReducer } from "@/widgets/MobileHeader/ui/MobileHeader/lib/mobileHeaderUtils";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getUserAuthData, userActions } from "@/entities/User";
import {
    getAboutProjectPageUrl, getAcademyMainPageUrl, getAmbassadorsPageUrl,
    getBlogPageUrl,
    getFindJobPageUrl, getHostDashboardPageUrl, getJournalsPageUrl,
    getMainPageUrl, getMembershipPageUrl,
    getMessengerPageUrl,
    getNewsPageUrl,
    getNPOPageUrl, getOffersMapPageUrl, getOurTeamPageUrl,
    getPrivacyPolicyPageUrl, getProfileInfoPageUrl,
    getRulesPageUrl, getSignInPageUrl,
    getVideoPageUrl,
    getVolunteerDashboardPageUrl,
} from "@/shared/config/routes/AppUrls";
import styles from "./NewMainSliderContainer.module.scss";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Popup from "@/components/Popup/Popup";
import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import sliderVolunteerImg from "@/shared/assets/images/slider-volunteer.png";
import sliderBackpackImg from "@/shared/assets/icons/slider-backpack.png";
import sliderHouseImg from "@/shared/assets/icons/slider-house.png";
import { MobileSelect } from "@/widgets/MobileHeader/ui/MobileSelect/MobileSelect";

type SliderState = "MIDDLE" | "LEFT-FULL" | "LEFT-HALF" | "LEFT" | "RIGHT" | "RIGHT-FULL" | "RIGHT-HALF";

interface DropdownState {
    isCommunityOpened: boolean;
    isAboutProjectOpened: boolean;
}

export const NewMainSliderContainer = () => {
    const [sliderState, setSliderState] = useState<SliderState>("MIDDLE");
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { myProfile, isAuth } = useAuth();
    const appDispatch = useAppDispatch();

    const authData = useAppSelector(getUserAuthData);
    const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
    const [dropdownOpened, dispatch] = useReducer(
        toggleDropdownReducer,
        initialState,
    );

    const communityRef = useRef(null);
    const aboutProjectRef = useRef(null);

    const [dropdownMenuOpened, setDropdownMenuOpened] = useState<DropdownState>({
        isCommunityOpened: false,
        isAboutProjectOpened: false,
    });

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

    useOnClickOutside(
        communityRef,
        () => setDropdownMenuOpened((prev) => ({ ...prev, isCommunityOpened: false })),
    );
    useOnClickOutside(
        aboutProjectRef,
        () => setDropdownMenuOpened((prev) => ({ ...prev, isAboutProjectOpened: false })),
    );

    const handleOpenDropdownMenu = (type: ButtonNav) => {
        setDropdownMenuOpened((prev) => {
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

    const handleLeftClick = () => {
        if (sliderState === "LEFT-FULL" || sliderState === "RIGHT-FULL") {
            setSliderState("MIDDLE");
            return;
        }
        setSliderState("LEFT-FULL");
    };

    const handleRightClick = () => {
        if (sliderState === "RIGHT-FULL" || sliderState === "LEFT-FULL") {
            setSliderState("MIDDLE");
            return;
        }
        setSliderState("RIGHT-FULL");
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div
                    className={cn(
                        styles.left,
                        { [styles.sliderFull]: sliderState === "LEFT-FULL" },
                        { [styles.sliderCollapsed]: sliderState === "RIGHT-FULL" },
                        { [styles.sliderHalf]: sliderState === "LEFT-HALF" },
                        { [styles.sliderAlmostHalf]: sliderState === "RIGHT-HALF" },
                    )}
                    onClick={handleLeftClick}
                    onMouseEnter={() => { if (!((sliderState === "RIGHT-FULL") || (sliderState === "LEFT-FULL"))) setSliderState("LEFT-HALF"); }}
                    onMouseLeave={() => { if (sliderState === "LEFT-HALF") setSliderState("MIDDLE"); }}
                >
                    <div className={cn(styles.content, { [styles.contentCollapsed]: sliderState === "RIGHT-FULL" }, { [styles.contentHalf]: sliderState === "LEFT-HALF" })}>
                        <h2>Путешествуй, помогай, меняй мир</h2>
                        <p>
                            Goodsurfing — способ путешествовать недорого,
                            занимаясь интересным и важным делом
                            с помощью волонтёрства или экспедиций.
                        </p>
                        <div className={styles.volunteersWrapper}>
                            <img src={sliderVolunteerImg} alt="slider volunteers" />
                            <p>С нами уже 90 000 путешественников со смыслом со всего мира</p>
                        </div>
                        <Button onClick={handleLeftClick} className={styles.buttonLeft} color="BLUE" size="MEDIUM" variant="OUTLINE">Присоединиться к сообществу</Button>
                    </div>
                    <div className={styles.cornerLeft}>
                        <ReactSVG
                            src={arrowIcon}
                            className={cn(
                                styles.arrow,
                                styles.arrowLeft,
                                { [styles.arrowLeftRotated]: sliderState === "RIGHT-FULL" },
                                { [styles.arrowHidden]: sliderState === "LEFT-FULL" },
                            )}
                        />
                    </div>
                    <img className={styles.sliderbackpackImg} src={sliderBackpackImg} alt="backpack" />
                </div>
                <div
                    className={cn(
                        styles.right,
                        { [styles.sliderFull]: sliderState === "RIGHT-FULL" },
                        { [styles.sliderCollapsed]: sliderState === "LEFT-FULL" },
                        { [styles.sliderHalf]: sliderState === "RIGHT-HALF" },
                        { [styles.sliderAlmostHalf]: sliderState === "LEFT-HALF" },
                    )}
                    onClick={handleRightClick}
                    onMouseEnter={() => { if (!((sliderState === "RIGHT-FULL") || (sliderState === "LEFT-FULL"))) setSliderState("RIGHT-HALF"); }}
                    onMouseLeave={() => { if (sliderState === "RIGHT-HALF") setSliderState("MIDDLE"); }}
                >
                    <div className={cn(styles.content, { [styles.contentCollapsed]: sliderState === "LEFT-FULL" }, { [styles.contentHalf]: sliderState === "RIGHT-HALF" })}>
                        <h2>Примите тех, кто хочет помогать и делайте мир лучше вместе</h2>
                        <p>
                            Мы соединяем вас с людьми, готовыми приехать к вам и помочь на месте.
                            Найдите помощников для задач на сезон, экспедицию или долгий проект.
                        </p>
                        <div className={styles.volunteersWrapper}>
                            <img src={sliderVolunteerImg} alt="slider volunteers" />
                            <p>С нами уже больше 1500 проектов</p>
                        </div>
                        <Button onClick={handleRightClick} className={styles.buttonRight} color="GREEN" size="MEDIUM" variant="OUTLINE">Присоединиться к сообществу</Button>
                    </div>
                    <div className={cn(styles.cornerRight)}>
                        <ReactSVG src={arrowIcon} className={cn(styles.arrow, styles.arrowRight, { [styles.arrowRightRotated]: sliderState === "LEFT-FULL" }, { [styles.arrowHidden]: sliderState === "RIGHT-FULL" })} />
                    </div>
                </div>
                <img className={styles.logo} src={sliderLogo} alt="goodsurfing logo" />
                <div className={styles.nav}>
                    <ChangeLanguage
                        classNameArrow={styles.arrowNav}
                        classNameArrowOpen={styles.arrowNavOpen}
                        localeApi={myProfile?.locale}
                        profileData={myProfile}
                    />
                    <div
                        ref={communityRef}
                        className={styles.link}
                        onClick={() => handleOpenDropdownMenu("COMMUNITY")}
                    >
                        <p>{t("main.welcome.header.community.title")}</p>
                        <Arrow
                            className={styles.arrowNav}
                            classNameOpen={styles.arrowNavOpen}
                            isOpen={dropdownMenuOpened.isCommunityOpened}
                        />
                        <Popup
                            isOpen={dropdownMenuOpened.isCommunityOpened}
                            className={styles.popup}
                        >
                            <Link to="https://community.goodsurfing.org/category/post/">
                                {t("main.welcome.header.community.blog")}
                            </Link>
                            <Link to="https://community.goodsurfing.org/filmy/">
                                {t("main.welcome.header.community.video")}
                            </Link>
                            <Link to={getAmbassadorsPageUrl(locale)}>
                                {t("main.welcome.header.community.ambassadors")}
                            </Link>
                            <Link to="https://community.goodsurfing.org/courses/">
                                {t("main.welcome.header.community.courses")}
                            </Link>
                        </Popup>
                    </div>
                    <div
                        ref={aboutProjectRef}
                        className={styles.link}
                        onClick={() => handleOpenDropdownMenu("ABOUT")}
                    >
                        <p>{t("main.welcome.header.about-project.title")}</p>
                        <Arrow
                            className={styles.arrowNav}
                            classNameOpen={styles.arrowNavOpen}
                            isOpen={dropdownMenuOpened.isAboutProjectOpened}
                        />
                        <Popup
                            isOpen={dropdownMenuOpened.isAboutProjectOpened}
                            className={styles.popup}
                        >
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
                </div>
                <div className={styles.navMobile}>
                    <ChangeLanguage
                        classNameArrow={styles.arrowNav}
                        classNameArrowOpen={styles.arrowNavOpen}
                        localeApi={myProfile?.locale}
                        profileData={myProfile}
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
                </div>
            </div>
            <div
                className={cn(styles.menu, {
                    [styles.active]: menuIsOpen,
                })}
            >
                <div className={styles.menuHeader}>
                    <Link to={getMainPageUrl(locale)}>
                        <img
                            src={mobileLogotype}
                            alt="GoodSurfing"
                            style={{ width: "150px" }}
                        />
                    </Link>
                    <ChangeLanguage
                        localeApi={myProfile?.locale}
                        profileData={myProfile}
                    />
                    <div
                        className={cn(styles.burger, styles.blue, {
                            [styles.open]: menuIsOpen,
                        })}
                        onClick={handleOpenMenu}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
                <div className={styles.container} />
                <ButtonMenu
                    onClick={() => navigate(getOffersMapPageUrl(locale))}
                    className={styles.button}
                >
                    {t("main.welcome.header.offers.title")}
                </ButtonMenu>
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
                </MobileSelect>
                {authData ? (
                    <>
                        <ButtonMenu
                            onClick={() => navigate(getProfileInfoPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.my-page")}
                        </ButtonMenu>
                        {/* <Button
                                    onClick={() => navigate(getFavoriteOffersPageUrl(locale))}
                                    className={styles.button}
                                >
                                    {t("main.welcome.header.favorite")}
                                </Button> */}
                        <ButtonMenu
                            onClick={() => navigate(getMessengerPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.messages")}
                        </ButtonMenu>
                        <ButtonMenu
                            onClick={() => navigate(getHostDashboardPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.host-dashboard")}
                        </ButtonMenu>
                        <ButtonMenu
                            onClick={() => navigate(getVolunteerDashboardPageUrl(locale))}
                            className={styles.button}
                        >
                            {t("main.welcome.header.volunteer-dashboard")}
                        </ButtonMenu>
                        <ButtonMenu
                            onClick={handleLogout}
                            className={styles.button}
                        >
                            {t("main.welcome.header.exit")}
                        </ButtonMenu>
                    </>
                ) : (
                    <ButtonMenu
                        onClick={() => navigate(getSignInPageUrl(locale))}
                        className={styles.button}
                    >
                        {t("main.welcome.header.sign-in")}
                    </ButtonMenu>
                )}
            </div>
        </>

    );
};

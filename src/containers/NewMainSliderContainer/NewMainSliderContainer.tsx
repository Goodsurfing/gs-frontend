import React, { useCallback, useReducer, useState } from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import Button from "@/shared/ui/Button/Button";
import sliderLogo from "@/shared/assets/icons/slider-logo.svg";
import styles from "./NewMainSliderContainer.module.scss";
import InfoHeader from "../WelcomeContainer/InfoSide/InfoHeader/InfoHeader";
import { ButtonNav, initialState, toggleDropdownReducer } from "@/widgets/MobileHeader/ui/MobileHeader/lib/mobileHeaderUtils";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getUserAuthData, userActions } from "@/entities/User";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

type SliderState = "MIDDLE" | "LEFT-FULL" | "LEFT-HALF" | "LEFT" | "RIGHT" | "RIGHT-FULL" | "RIGHT-HALF";

export const NewMainSliderContainer = () => {
    const [sliderState, setSliderState] = useState<SliderState>("MIDDLE");
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

    const handleLeftArrowClick = () => {
        if (sliderState === "RIGHT-FULL") {
            setSliderState("MIDDLE");
            return;
        }
        setSliderState("LEFT-FULL");
    };

    const handleRightArrowClick = () => {
        if (sliderState === "LEFT-FULL") {
            setSliderState("MIDDLE");
            return;
        }
        setSliderState("RIGHT-FULL");
    };

    return (
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
                    <h2>Left Side</h2>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Voluptas eos esse quia deleniti,
                        debitis quam vitae eaque aliquid asperiores numquam
                        id exercitationem facere culpa quidem quae suscipit tempore quos itaque.
                    </p>
                    <Button onClick={handleLeftClick} className={styles.buttonLeft} color="BLUE" size="MEDIUM" variant="OUTLINE">Раскрыть</Button>
                </div>
                <div className={styles.cornerLeft}>
                    <ReactSVG onClick={handleLeftArrowClick} src={arrowIcon} className={cn(styles.arrow, styles.arrowLeft, { [styles.arrowLeftRotated]: sliderState === "RIGHT-FULL" }, { [styles.arrowHidden]: sliderState === "LEFT-FULL" })} />
                </div>
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
                    <h2>Right Side</h2>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                        Voluptas eos esse quia deleniti,
                        debitis quam vitae eaque aliquid asperiores numquam
                        id exercitationem facere culpa quidem quae suscipit tempore quos itaque.
                    </p>
                    <Button onClick={handleRightClick} className={styles.buttonRight} color="GREEN" size="MEDIUM" variant="OUTLINE">Раскрыть</Button>
                </div>
                <div className={cn(styles.cornerRight)}>
                    <ReactSVG onClick={handleRightArrowClick} src={arrowIcon} className={cn(styles.arrow, styles.arrowRight, { [styles.arrowRightRotated]: sliderState === "LEFT-FULL" }, { [styles.arrowHidden]: sliderState === "RIGHT-FULL" })} />
                </div>
            </div>
            <img className={styles.logo} src={sliderLogo} alt="goodsurfing logo" />
            <div className={styles.nav}>
                <InfoHeader />
            </div>
        </div>
    );
};

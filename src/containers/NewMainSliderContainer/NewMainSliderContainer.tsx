import React, { useState } from "react";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import Button from "@/shared/ui/Button/Button";
import styles from "./NewMainSliderContainer.module.scss";

type SliderState = "MIDDLE" | "LEFT-FULL" | "LEFT-HALF" | "LEFT" | "RIGHT" | "RIGHT-FULL" | "RIGHT-HALF";

export const NewMainSliderContainer = () => {
    const [sliderState, setSliderState] = useState<SliderState>("MIDDLE");

    const handleLeftClick = () => {
        if (sliderState === "LEFT-FULL") {
            setSliderState("MIDDLE");
            return;
        }
        setSliderState("LEFT-FULL");
    };

    const handleRightClick = () => {
        if (sliderState === "RIGHT-FULL") {
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
            <div className={cn(styles.left, { [styles.sliderFull]: sliderState === "LEFT-FULL" }, { [styles.sliderCollapsed]: sliderState === "RIGHT-FULL" })}>
                <div className={cn(styles.content, { [styles.contentCollapsed]: sliderState === "RIGHT-FULL" })}>
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
            <div className={cn(styles.right, { [styles.sliderFull]: sliderState === "RIGHT-FULL" }, { [styles.sliderCollapsed]: sliderState === "LEFT-FULL" })}>
                <div className={cn(styles.content, { [styles.contentCollapsed]: sliderState === "LEFT-FULL" })}>
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
        </div>
    );
};

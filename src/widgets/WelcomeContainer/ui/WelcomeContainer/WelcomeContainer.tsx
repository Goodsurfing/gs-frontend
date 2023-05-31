import React, { FC, memo } from "react";

import LogotypeIcon from "shared/assets/icons/logo.svg";

import { MemoInfoSide as InfoSide } from "../InfoSlide/InfoSide";
import { MemoSliderSide as SliderSide } from "../SliderSlide/SliderSide";

import styles from "./WelcomeContainer.module.scss";

const WelcomeContainer: FC = () => (
    <main className={styles.wrapper}>
        <div className={styles.slider}>
            <img
                src={LogotypeIcon}
                alt="Logotype"
                className={styles.logotype}
            />
            <SliderSide />
        </div>
        <div className={styles.info}>
            <InfoSide />
        </div>
    </main>
);

export const MemoWelcomeContainer = memo(WelcomeContainer);

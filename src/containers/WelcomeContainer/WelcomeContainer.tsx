import React, { FC } from "react";

import InfoSide from "@/containers/WelcomeContainer/InfoSide/InfoSide";
import SliderSide from "@/containers/WelcomeContainer/SliderSide/SliderSide";

import styles from "./WelcomeContainer.module.scss";

interface WelcomeContainerProps {}

const WelcomeContainer: FC<WelcomeContainerProps> = (props) => {
    return (
        <main className={styles.wrapper}>
            <div className={styles.slider}>
                <SliderSide />
            </div>
            <div className={styles.info}>
                <InfoSide />
            </div>
        </main>
    );
};

export default WelcomeContainer;

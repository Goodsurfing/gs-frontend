import { FC, memo } from "react";

import InfoSide from "@/containers/WelcomeContainer/InfoSide/InfoSide";
import SliderSide from "@/containers/WelcomeContainer/SliderSide/SliderSide";

import InfoHeader from "./InfoSide/InfoHeader/InfoHeader";
import styles from "./WelcomeContainer.module.scss";

const WelcomeContainer: FC = memo(() => (
    <main className={styles.wrapper}>
        <div className={styles.info}>
            <InfoSide />
        </div>
        <div className={styles.slider}>
            <InfoHeader />
            <SliderSide />
        </div>
    </main>
));

export default WelcomeContainer;

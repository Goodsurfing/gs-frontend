import { FC, memo } from "react";

import InfoHeader from "./InfoSide/InfoHeader/InfoHeader";
import InfoSide from "./InfoSide/InfoSide";
import SliderSide from "./SliderSide/SliderSide";
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

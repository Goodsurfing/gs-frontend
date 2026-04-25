import { FC, memo } from "react";

import MainHeader from "@/widgets/MainHeader/MainHeader";

import InfoSide from "./InfoSide/InfoSide";
import SliderSide from "./SliderSide/SliderSide";
import styles from "./WelcomeContainer.module.scss";

const WelcomeContainer: FC = memo(() => (
    <>
        <MainHeader />
        <main className={styles.wrapper}>
            <div className={styles.info}>
                <InfoSide />
            </div>
            <div className={styles.slider}>
                <SliderSide />
            </div>
        </main>
    </>
));

export default WelcomeContainer;

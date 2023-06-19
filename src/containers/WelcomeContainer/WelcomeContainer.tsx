import React, { FC } from 'react';

import InfoSide from 'containers/WelcomeContainer/InfoSide/InfoSide';
import SliderSide from 'containers/WelcomeContainer/SliderSide/SliderSide';

import LogotypeIcon from 'assets/icons/logo.svg';

import styles from './WelcomeContainer.module.scss';

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

export default WelcomeContainer;

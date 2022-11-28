import React, { FC } from 'react';
import styles from './WelcomeContainer.module.scss';
import SliderSide from "@/containers/WelcomeContainer/SliderSide/SliderSide";

interface WelcomeContainerProps {}

const WelcomeContainer: FC<WelcomeContainerProps> = (props) => {

  return (
      <main className={styles.wrapper}>
          <SliderSide />
      </main>
  );
};

export default WelcomeContainer;

import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import Header from "../Header/Header";
import { HowItStarted } from "../HowItStarted/HowItStarted";
import { Mission } from "../Mission/Mission";
import styles from "./AboutProjectPage.module.scss";

const AboutProjectPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <Mission className={styles.section} />
            <HowItStarted className={styles.section} />
            <Prin
        </div>
    </MainPageLayout>
);

export default AboutProjectPage;

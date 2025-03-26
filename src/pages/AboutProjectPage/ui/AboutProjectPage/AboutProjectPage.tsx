import React from "react";

import cn from "classnames";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import Header from "../Header/Header";
import { HowItStarted } from "../HowItStarted/HowItStarted";
import { Mission } from "../Mission/Mission";
import { Principles } from "../Principles/Principles";
import { GoodsurfingNow } from "../GoodsurfingNow/GoodsurfingNow";
import { Gallery } from "../Gallery/Gallery";
import styles from "./AboutProjectPage.module.scss";

const AboutProjectPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <Mission className={styles.section} />
            <HowItStarted className={styles.section} />
            <Principles className={cn(styles.section, styles.extraPadding)} />
            <GoodsurfingNow className={cn(styles.section, styles.extraPadding)} />
            <Gallery className={styles.section} />
        </div>
    </MainPageLayout>
);

export default AboutProjectPage;

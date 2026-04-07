import React from "react";

import cn from "classnames";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import Header from "../Header/Header";
import { HowItStarted } from "../HowItStarted/HowItStarted";
import { Mission } from "../Mission/Mission";
import { Principles } from "../Principles/Principles";
import { GoodsurfingNow } from "../GoodsurfingNow/GoodsurfingNow";
import { Gallery } from "../Gallery/Gallery";
import { useGetAbouProjectPageInfoQuery } from "@/entities/Admin";
import Preloader from "@/shared/ui/Preloader/Preloader";
import styles from "./AboutProjectPage.module.scss";

const AboutProjectPage = () => {
    const { data, isLoading } = useGetAbouProjectPageInfoQuery();

    if (isLoading || !data) {
        return (
            <MainPageLayout>
                <Preloader />
            </MainPageLayout>
        );
    }

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header />
                <Mission className={styles.section} description={data.mission} />
                <HowItStarted className={styles.section} description={data.howAllStart} />
                <Principles
                    className={cn(styles.section, styles.extraPadding)}
                    principles={data.principles}
                />
                <GoodsurfingNow
                    className={cn(styles.section, styles.extraPadding)}
                    today={data.today}
                />
                <Gallery className={styles.section} gallery={data.galleryImages} />
            </div>
        </MainPageLayout>
    );
};

export default AboutProjectPage;

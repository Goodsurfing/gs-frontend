import React from "react";
import cn from "classnames";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import HowItWorkContainer from "@/containers/HowItWorkContainer/HowItWorkContainer";
import OffersContainer from "@/containers/OffersContainer/OffersContainer";
import { FindOffer } from "../FindOffer/FindOffer";
import styles from "./FindJobPage.module.scss";
import { SeasonalWork } from "../SeasonalWork/SeasonalWork";

const FindJobPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <h2 className={styles.title}>Как это работает?</h2>
                <HowItWorkContainer className={cn(styles.howItWork, styles.container)} />
                <h2 className={styles.title}>Интересные вакансии</h2>
                <OffersContainer className={styles.container} />
            </div>
            <FindOffer />
            <div className={styles.content}>
                <SeasonalWork />
            </div>
        </div>
    </MainPageLayout>
);

export default FindJobPage;

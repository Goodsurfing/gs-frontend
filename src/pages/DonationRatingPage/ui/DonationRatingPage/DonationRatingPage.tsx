import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Header } from "../Header/Header";
import styles from "./DonationRatingPage.module.scss";
import { DonationRating } from "../DonationRating/DonationRating";

const DonationRatingPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <DonationRating />
            </div>
        </div>
    </MainPageLayout>
);

export default DonationRatingPage;

import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Description } from "../Description/Description";
import { Header } from "../Header/Header";
import { Reports } from "../Reports/Reports";
import styles from "./DonationReportsPage.module.scss";

const DonationReportsPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <Description />
                <Reports />
            </div>
        </div>
    </MainPageLayout>
);

export default DonationReportsPage;

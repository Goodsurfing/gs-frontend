import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import styles from "./OurTeamPage.module.scss";

const OurTeamPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <Founders />
            </div>
        </div>
    </MainPageLayout>
);

export default OurTeamPage;

import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import styles from "./MembershipPage.module.scss";

const MembershipPage = () => (
    <MainPageLayout>
        <div className={styles.innerWrapper}>
            <Header />
            <HowItWorks />
        </div>
    </MainPageLayout>
);

export default MembershipPage;

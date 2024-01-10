import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import styles from "./MembershipPage.module.scss";
import { ForVolunteer } from "../ForVolunteer/ForVolunteer";

const MembershipPage = () => (
    <MainPageLayout>
        <div className={styles.innerWrapper}>
            <Header />
            <HowItWorks className={styles.section} />
            <ForVolunteer className={styles.section} />
        </div>
    </MainPageLayout>
);

export default MembershipPage;

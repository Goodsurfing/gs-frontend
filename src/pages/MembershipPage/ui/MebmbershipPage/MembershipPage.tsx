import React from "react";
import { useTranslation } from "react-i18next";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { DonationSection } from "../DonationSection/DonationSection";
import { ForHost } from "../ForHost/ForHost";
import { ForVolunteer } from "../ForVolunteer/ForVolunteer";
import { Header } from "../Header/Header";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import { Questions } from "../Questions/Questions";
import { Review } from "../Review/Review";
import { WhatIsGoodsurfing } from "../WhatIsGoodsurfing/WhatIsGoodsurfing";
import { WhyMembership } from "../WhyMembership/WhyMembership";
import styles from "./MembershipPage.module.scss";

const MembershipPage = () => {
    const { ready } = useTranslation("membership");

    if (!ready) {
        return (
            <Preloader />
        );
    }

    return (
        <MainPageLayout>
            <div className={styles.innerWrapper}>
                <Header />
                <WhyMembership />
                <ForVolunteer className={styles.section} />
                <HowItWorks className={styles.section} />
                <ForHost className={styles.section} />
                <DonationSection className={styles.section} />
                <WhatIsGoodsurfing className={styles.section} />
                <Review className={styles.section} />
                <Questions className={styles.section} />
            </div>
        </MainPageLayout>
    );
};

export default MembershipPage;

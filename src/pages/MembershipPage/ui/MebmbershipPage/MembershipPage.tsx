import React from "react";
import { useTranslation } from "react-i18next";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { ForHost } from "../ForHost/ForHost";
import { ForVolunteer } from "../ForVolunteer/ForVolunteer";
import { Header } from "../Header/Header";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import { Questions } from "../Questions/Questions";
import { Review } from "../Review/Review";
import { WhatIsGoodsurfing } from "../WhatIsGoodsurfing/WhatIsGoodsurfing";
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
                <HowItWorks className={styles.section} />
                <ForVolunteer className={styles.section} />
                <ForHost className={styles.section} />
                <WhatIsGoodsurfing className={styles.section} />
                <Review className={styles.section} />
                <Questions className={styles.section} />
            </div>
        </MainPageLayout>
    );
};

export default MembershipPage;

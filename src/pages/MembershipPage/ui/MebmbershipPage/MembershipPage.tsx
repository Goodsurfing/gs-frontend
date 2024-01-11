import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import styles from "./MembershipPage.module.scss";
import { ForVolunteer } from "../ForVolunteer/ForVolunteer";
import { ForHost } from "../ForHost/ForHost";
import { WhatIsGoodsurfing } from "../WhatIsGoodsurfing/WhatIsGoodsurfing";
import { Questions } from "../Questions/Questions";

const MembershipPage = () => (
    <MainPageLayout>
        <div className={styles.innerWrapper}>
            <Header />
            <HowItWorks className={styles.section} />
            <ForVolunteer className={styles.section} />
            <ForHost className={styles.section} />
            <WhatIsGoodsurfing className={styles.section} />
            <Questions className={styles.section} />
        </div>
    </MainPageLayout>
);

export default MembershipPage;

import React from "react";
import styles from "./BecomeHostPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { WhoCanInvite } from "../WhoCanInvite/WhoCanInvite";
import { HowCanHelp } from "../HowCanHelp/HowCanHelp";
import { WhatReturn } from "../WhatReturn/WhatReturn";
import { ProjectBetter } from "../ProjectBetter/ProjectBetter";
import { WhoIsGoodsurfers } from "../WhoIsGoodsurfers/WhoIsGoodsurfers";

const BecomeHostPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <WhoCanInvite />
            <HowCanHelp />
            <WhatReturn />
            <ProjectBetter />
            <WhoIsGoodsurfers />
        </div>
    </MainPageLayout>
);

export default BecomeHostPage;

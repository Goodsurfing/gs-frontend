import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import styles from "./OurTeamPage.module.scss";
import { Founders } from "../Founders/Founders";
import { GoodsurfingTeam } from "../GoodsurfingTeam/GoodsurfingTeam";
import Button from "@/shared/ui/Button/Button";

const OurTeamPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <Founders />
                <GoodsurfingTeam />
                <Button className={styles.button} size="MEDIUM" color="BLUE" variant="FILL">Хочу в команду</Button>
            </div>
        </div>
    </MainPageLayout>
);

export default OurTeamPage;

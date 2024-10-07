import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import Button from "@/shared/ui/Button/Button";

import { Founders } from "../Founders/Founders";
import { GoodsurfingTeam } from "../GoodsurfingTeam/GoodsurfingTeam";
import { Header } from "../Header/Header";
import styles from "./OurTeamPage.module.scss";

const OurTeamPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <Founders />
                <GoodsurfingTeam />
                <Button
                    className={styles.button}
                    size="MEDIUM"
                    color="BLUE"
                    variant="FILL"
                >
                    Хочу в команду
                </Button>
            </div>
        </div>
    </MainPageLayout>
);

export default OurTeamPage;

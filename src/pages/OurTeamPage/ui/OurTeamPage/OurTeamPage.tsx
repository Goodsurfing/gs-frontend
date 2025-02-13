import React from "react";

import { useTranslation } from "react-i18next";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import Button from "@/shared/ui/Button/Button";

import { Founders } from "../Founders/Founders";
import { GoodsurfingTeam } from "../GoodsurfingTeam/GoodsurfingTeam";
import { Header } from "../Header/Header";
import styles from "./OurTeamPage.module.scss";

const OurTeamPage = () => {
    const { t } = useTranslation("our-team");
    return (
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
                        {t("Хочу в команду")}
                    </Button>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default OurTeamPage;

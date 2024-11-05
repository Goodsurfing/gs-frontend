import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Header } from "../Header/Header";
import styles from "./GoodsurfingAmbassadorsPage.module.scss";
import { Ambassador } from "../Ambassador/Ambassador";
import { Text } from "../Text/Text";

const GoodsurfingAmbassadorsPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <Text />
                <Ambassador />
            </div>
        </div>
    </MainPageLayout>
);

export default GoodsurfingAmbassadorsPage;

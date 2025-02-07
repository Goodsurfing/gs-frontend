import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Ambassador } from "../Ambassador/Ambassador";
import { Header } from "../Header/Header";
import { Text } from "../Text/Text";
import styles from "./GoodsurfingAmbassadorsPage.module.scss";

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

import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Description } from "../Description/Description";
import { Documents } from "../Documents/Documents";
import { Header } from "../Header/Header";
import { Reports } from "../Reports/Reports";
import styles from "./NPOPage.module.scss";

const NPOPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <div className={styles.content}>
                <Description />
                <Documents />
                <Reports />
            </div>
        </div>
    </MainPageLayout>
);

export default NPOPage;

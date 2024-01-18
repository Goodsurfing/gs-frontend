import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { Description } from "../Description/Description";

import styles from "./NPOPage.module.scss";
import { Documents } from "../Documents/Documents";
import { Reports } from "../Reports/Reports";

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

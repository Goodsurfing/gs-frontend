import React from "react";

import styles from "./NPOPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";

const NPOPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
        </div>
    </MainPageLayout>
);

export default NPOPage;

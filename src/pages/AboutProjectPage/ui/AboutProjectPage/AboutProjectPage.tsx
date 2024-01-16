import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import Header from "../Header/Header";
import styles from "./AboutProjectPage.module.scss";

const AboutProjectPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
        </div>
    </MainPageLayout>
);

export default AboutProjectPage;

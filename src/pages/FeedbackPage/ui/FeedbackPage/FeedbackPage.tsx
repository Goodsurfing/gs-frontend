import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Header } from "../Header/Header";
import { FeedbackForm } from "../FeedbackForm/FeedbackForm";

import styles from "./FeedbackPage.module.scss";

const FeedbackPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <FeedbackForm className={styles.form} />
        </div>
    </MainPageLayout>
);

export default FeedbackPage;

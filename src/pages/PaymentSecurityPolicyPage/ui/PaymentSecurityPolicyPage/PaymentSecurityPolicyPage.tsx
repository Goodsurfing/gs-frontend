import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Header } from "../Header/Header";
import { TextContent } from "../TextContent/TextContent";

import styles from "./PaymentSecurityPolicyPage.module.scss";

const PaymentSecurityPolicyPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <TextContent className={styles.content} />
        </div>
    </MainPageLayout>
);

export default PaymentSecurityPolicyPage;

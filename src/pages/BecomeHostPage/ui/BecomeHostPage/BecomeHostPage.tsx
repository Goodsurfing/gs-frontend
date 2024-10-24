import React from "react";
import styles from "./BecomeHostPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { WhoCanInvite } from "../WhoCanInvite/WhoCanInvite";

const BecomeHostPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <Header />
            <WhoCanInvite />
        </div>
    </MainPageLayout>
);

export default BecomeHostPage;

import React from "react";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OffersMap } from "../OffersMap/OffersMap";
import styles from "./OffersMapPage.module.scss";

const OffersMapPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <OffersMap />
        </div>
    </MainPageLayout>
);

export default OffersMapPage;

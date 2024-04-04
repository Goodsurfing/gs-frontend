import React from "react";
import styles from "./OffersMapPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OffersMap } from "../OffersMap/OffersMap";

const OffersMapPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <OffersMap />
        </div>
    </MainPageLayout>
);

export default OffersMapPage;

import React from "react";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import styles from "./OffersMapPage.module.scss";
import { OffersMap } from "@/widgets/OffersMap";

const OffersMapPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <div className={styles.wrapperOffersMap}>

                <OffersMap />
            </div>
        </div>
    </MainPageLayout>
);

export default OffersMapPage;

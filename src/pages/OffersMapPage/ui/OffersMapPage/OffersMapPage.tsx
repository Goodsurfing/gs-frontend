import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OffersSearchFilter } from "../OffersSearchFilter/OffersSearchFilter";
import styles from "./OffersMapPage.module.scss";

const OffersMapPage = () => (
    <MainPageLayout
        isFooterShow={false}
        headerVariant="static"
        className={styles.wrapper}
    >
        <OffersSearchFilter />
    </MainPageLayout>
);

export default OffersMapPage;

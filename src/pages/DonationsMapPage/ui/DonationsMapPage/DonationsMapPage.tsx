import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { DonationSearchFilter } from "../DonationSearchFilter/DonationSearchFilter";
import styles from "./DonationsMapPage.module.scss";

const DonationsMapPage = () => (
    <MainPageLayout isFooterShow={false} className={styles.wrapper}>
        <DonationSearchFilter />
    </MainPageLayout>
);

export default DonationsMapPage;

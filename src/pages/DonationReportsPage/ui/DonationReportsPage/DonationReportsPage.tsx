import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Description } from "../Description/Description";
import { Header } from "../Header/Header";
import { Reports } from "../Reports/Reports";
import styles from "./DonationReportsPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getDonationReports } from "@/shared/config/routes/AppUrls";
import { PageSeo } from "@/shared/ui/SeoHelmet";

const DonationReportsPage = () => {
    const { locale } = useLocale();

    return (
        <MainPageLayout>
            <PageSeo section="donationReports" path={getDonationReports(locale)} />
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <Description />
                    <Reports />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default DonationReportsPage;

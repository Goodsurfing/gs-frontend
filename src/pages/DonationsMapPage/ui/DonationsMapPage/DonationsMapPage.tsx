import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { DonationSearchFilter } from "../DonationSearchFilter/DonationSearchFilter";
import styles from "./DonationsMapPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getDonationsMapPageUrl } from "@/shared/config/routes/AppUrls";
import { PageSeo } from "@/shared/ui/SeoHelmet";

const DonationsMapPage = () => {
    const { locale } = useLocale();

    return (
        <MainPageLayout
            isFooterShow={false}
            headerVariant="static"
            className={styles.wrapper}
        >
            <PageSeo section="donationsMap" path={getDonationsMapPageUrl(locale)} />
            <DonationSearchFilter />
        </MainPageLayout>
    );
};

export default DonationsMapPage;

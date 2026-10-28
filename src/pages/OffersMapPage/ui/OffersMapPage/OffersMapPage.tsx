import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OffersSearchFilter } from "../OffersSearchFilter/OffersSearchFilter";
import styles from "./OffersMapPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";
import { PageSeo } from "@/shared/ui/SeoHelmet";

const OffersMapPage = () => {
    const { locale } = useLocale();

    return (
        <MainPageLayout
            isFooterShow={false}
            headerVariant="static"
            className={styles.wrapper}
        >
            <PageSeo section="offersMap" path={getOffersMapPageUrl(locale)} />
            <OffersSearchFilter />
        </MainPageLayout>
    );
};

export default OffersMapPage;

import React from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { Reports } from "@/pages/DonationReportsPage";
import { getNPOPageUrl } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Description } from "../Description/Description";
import { Documents } from "../Documents/Documents";
import { Header } from "../Header/Header";
import styles from "./NPOPage.module.scss";

const NPOPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("npo");

    return (
        <MainPageLayout>
            {ready && (
                <SeoHelmet
                    title={t("seo.title")}
                    description={t("seo.description")}
                    canonicalUrl={getSeoUrl(getNPOPageUrl(locale))}
                    keywords={t("seo.keywords")}
                    ogTitle={t("seo.ogTitle")}
                    ogDescription={t("seo.ogDescription")}
                />
            )}
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <Description />
                    <Documents />
                    <Reports />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default NPOPage;

import React from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { getAmbassadorsPageUrl } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";

import { Ambassador } from "../Ambassador/Ambassador";
import { Header } from "../Header/Header";
import { Text } from "../Text/Text";
import styles from "./GoodsurfingAmbassadorsPage.module.scss";

const GoodsurfingAmbassadorsPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("ambassadors");

    return (
        <MainPageLayout>
            {ready && (
                <SeoHelmet
                    title={t("seo.title")}
                    description={t("seo.description")}
                    canonicalUrl={getSeoUrl(getAmbassadorsPageUrl(locale))}
                    keywords={t("seo.keywords")}
                    ogTitle={t("seo.ogTitle")}
                    ogDescription={t("seo.ogDescription")}
                />
            )}
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <Text />
                    <Ambassador />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default GoodsurfingAmbassadorsPage;

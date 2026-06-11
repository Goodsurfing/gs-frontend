import React from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getDonationRating } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { DonationRating } from "../DonationRating/DonationRating";
import { Header } from "../Header/Header";
import styles from "./DonationRatingPage.module.scss";

const DonationRatingPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("donation");

    return (
        <MainPageLayout>
            {ready && (
                <SeoHelmet
                    title={t("ratingSeo.title")}
                    description={t("ratingSeo.description")}
                    canonicalUrl={getSeoUrl(getDonationRating(locale))}
                    keywords={t("ratingSeo.keywords")}
                    ogTitle={t("ratingSeo.ogTitle")}
                    ogDescription={t("ratingSeo.ogDescription")}
                />
            )}
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <DonationRating />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default DonationRatingPage;

import React from "react";
import { useTranslation } from "react-i18next";

import cn from "classnames";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetAbouProjectPageInfoQuery } from "@/entities/Admin";
import { getAboutProjectPageUrl } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Gallery } from "../Gallery/Gallery";
import { GoodsurfingNow } from "../GoodsurfingNow/GoodsurfingNow";
import Header from "../Header/Header";
import { HowItStarted } from "../HowItStarted/HowItStarted";
import { Mission } from "../Mission/Mission";
import { Principles } from "../Principles/Principles";
import styles from "./AboutProjectPage.module.scss";

const AboutProjectPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("about-project");
    const { data, isLoading } = useGetAbouProjectPageInfoQuery();
    const seo = ready && (
        <SeoHelmet
            title={t("seo.title")}
            description={t("seo.description")}
            canonicalUrl={getSeoUrl(getAboutProjectPageUrl(locale))}
            keywords={t("seo.keywords")}
            ogTitle={t("seo.ogTitle")}
            ogDescription={t("seo.ogDescription")}
        />
    );

    if (isLoading || !data) {
        return (
            <MainPageLayout>
                {seo}
                <Preloader />
            </MainPageLayout>
        );
    }

    return (
        <MainPageLayout>
            {seo}
            <div className={styles.wrapper}>
                <Header />
                {data.mission && (
                    <Mission className={styles.section} description={data.mission} />
                )}
                {data.howAllStart && (
                    <HowItStarted className={styles.section} description={data.howAllStart} />
                )}
                {data.principles.length > 0 && (
                    <Principles
                        className={cn(styles.section, styles.extraPadding)}
                        principles={data.principles}
                    />
                )}
                <GoodsurfingNow
                    className={cn(styles.section, styles.extraPadding)}
                    today={data.today}
                />
                {data.galleryImages.length > 0 && (
                    <Gallery className={styles.section} gallery={data.galleryImages} />
                )}
            </div>
        </MainPageLayout>
    );
};

export default AboutProjectPage;

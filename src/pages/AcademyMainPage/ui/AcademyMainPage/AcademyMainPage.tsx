import React from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { HowItWorkContainer } from "@/pages/MainPage";
import { CoursesList } from "@/widgets/Academy";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { getAcademyMainPageUrl } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";

import Section from "@/shared/ui/Section/Section";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";

import { Header } from "../Header/Header";
import styles from "./AcademyMainPage.module.scss";

const AcademyMainPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("academy");

    return (
        <MainPageLayout headerVariant="static">
            {ready && (
                <SeoHelmet
                    title={t("seo.main.title")}
                    description={t("seo.main.description")}
                    canonicalUrl={getSeoUrl(getAcademyMainPageUrl(locale))}
                    keywords={t("seo.main.keywords")}
                    ogTitle={t("seo.main.ogTitle")}
                    ogDescription={t("seo.main.ogDescription")}
                />
            )}
            <div className={styles.wrapper}>
                <Header />
                <Section title="Как это работает?">
                    <HowItWorkContainer showButton={false} />
                </Section>
                <Section title="Курсы" classNameWrapper={styles.courseList} id="courses">
                    <p className={styles.description}>
                        Авторские курсы от экспертов помогут вам научиться новому в
                        путешествиях и волонтерстве. Смотрите, выполняйте домашние
                        задания, получайте сертификацию.
                    </p>

                    <CoursesList className={styles.list} />
                </Section>
            </div>
        </MainPageLayout>
    );
};

export default AcademyMainPage;

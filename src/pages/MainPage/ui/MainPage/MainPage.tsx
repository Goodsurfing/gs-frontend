import { FC } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import Section from "@/shared/ui/Section/Section";

import BecomeHostContainer from "@/containers/BecomeHostContainer/BecomeHostContainer";
import CommunityNewsContainer from "@/containers/CommunityNewsContainer/CommunityNewsContainer";
import { Footer } from "@/widgets/Footer";
// import PopularPlacesContainer from "@/containers/PopularPlacesContainer/PopularPlacesContainer";
import ReviewsContainer from "@/containers/ReviewsContainer/ReviewsContainer";
import VolunteerContainer from "@/containers/VolunteerContainer/VolunteerContainer";

import Preloader from "@/shared/ui/Preloader/Preloader";
// import { NewMainSliderContainer }
// from "@/containers/NewMainSliderContainer/NewMainSliderContainer";
import { BannerCard } from "../BannerCard/BannerCard";
import WelcomeContainer from "../WelcomeContainer/WelcomeContainer";
import { HowItWorkContainer } from "../HowItWorkContainer/HowItWorkContainer";
import { OffersSlider } from "@/widgets/OffersSlider";
import { BenefitsContainer } from "@/widgets/BenefitsContainer";
import { MAIN_URL } from "@/shared/constants/api";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import styles from "./MainPage.module.scss";

const getMainPageCanonicalUrl = (locale: string) => {
    const siteUrl = MAIN_URL && MAIN_URL !== "undefined"
        ? MAIN_URL.replace(/\/$/, "")
        : "https://goodsurfing.org";

    return `${siteUrl}/${locale}`;
};

const MainPage: FC = () => {
    const { t, ready } = useTranslation("main");
    const { locale } = useLocale();

    if (!ready) {
        return (
            <Preloader />
        );
    }

    return (
        <>
            <SeoHelmet
                title={t("seo.title")}
                description={t("seo.description")}
                canonicalUrl={`${MAIN_URL.replace(/\/$/, "")}/${locale}`}
                ogTitle={t("seo.ogTitle")}
                ogDescription={t("seo.ogDescription")}
                ogUrl={getMainPageCanonicalUrl(locale)}
            />
            <WelcomeContainer />
            {/* <NewMainSliderContainer /> */}
            <Section title={t("Как это работает?")}>
                <HowItWorkContainer />
            </Section>
            <BannerCard />
            <Section title={t("Интересные вакансии")} className={styles.offersContainer}>
                <OffersSlider />
            </Section>
            <Section title={t("Наши преимущества")}>
                <BenefitsContainer />
            </Section>
            {/* <Section title={t("Популярные места")}>
                <PopularPlacesContainer />
            </Section> */}
            <section className={styles.volunteer}>
                <VolunteerContainer />
            </section>
            <section className={styles.reviews}>
                <ReviewsContainer />
            </section>
            <Section title={t("Новое из Сообщества")}>
                <CommunityNewsContainer />
            </Section>
            <section className={styles.host}>
                <BecomeHostContainer />
            </section>
            <Footer />
        </>
    );
};

export default MainPage;

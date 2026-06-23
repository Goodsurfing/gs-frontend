import { FC } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MAIN_URL } from "@/shared/constants/api";
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
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import styles from "./MainPage.module.scss";

const mainPageLocales = ["ru", "en", "es"] as const;

const MainPage: FC = () => {
    const { t, ready } = useTranslation("main");
    const { locale } = useLocale();

    if (!ready) {
        return (
            <Preloader />
        );
    }

    const mainPageSeoUrl = getSeoUrl(getMainPageUrl(locale));
    const alternateUrls = mainPageLocales.map((localeItem) => ({
        hrefLang: localeItem,
        href: getSeoUrl(getMainPageUrl(localeItem)),
    }));
    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "GoodSurfing",
            url: getSeoUrl("/"),
            inLanguage: locale,
            description: t("seo.description"),
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GoodSurfing",
            url: MAIN_URL,
            description: t("seo.description"),
        },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("seo.title"),
            description: t("seo.description"),
            url: mainPageSeoUrl,
            inLanguage: locale,
            about: [
                { "@type": "Thing", name: t("geo.about.volunteering") },
                { "@type": "Thing", name: t("geo.about.travel") },
                { "@type": "Thing", name: t("geo.about.expeditions") },
            ],
            isPartOf: {
                "@type": "WebSite",
                name: "GoodSurfing",
                url: getSeoUrl("/"),
            },
        },
    ];

    return (
        <>
            <SeoHelmet
                title={t("seo.title")}
                description={t("seo.description")}
                canonicalUrl={mainPageSeoUrl}
                keywords={t("seo.keywords")}
                ogTitle={t("seo.ogTitle")}
                ogDescription={t("seo.ogDescription")}
                alternateUrls={alternateUrls}
                structuredData={structuredData}
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

import React from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { MAIN_URL } from "@/shared/constants/api";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { DonationSection } from "../DonationSection/DonationSection";
import { ForHost } from "../ForHost/ForHost";
import { ForVolunteer } from "../ForVolunteer/ForVolunteer";
import { Header } from "../Header/Header";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import { InternationalClub } from "../InternationalClub/InternationalClub";
import { Questions } from "../Questions/Questions";
import { Review } from "../Review/Review";
import { WhatIsGoodsurfing } from "../WhatIsGoodsurfing/WhatIsGoodsurfing";
import { WhyMembership } from "../WhyMembership/WhyMembership";
import { getMembershipFaq } from "../../lib/getMembershipFaq";
import styles from "./MembershipPage.module.scss";

const membershipLocales = ["ru", "en", "es"] as const;

const MembershipPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation("membership");

    if (!ready) {
        return (
            <Preloader />
        );
    }

    const canonicalUrl = getSeoUrl(getMembershipPageUrl(locale));
    const alternateUrls = membershipLocales.map((localeItem) => ({
        hrefLang: localeItem,
        href: getSeoUrl(getMembershipPageUrl(localeItem)),
    }));
    const faqItems = getMembershipFaq(t);
    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("seo.title"),
            description: t("seo.description"),
            url: canonicalUrl,
            inLanguage: locale,
            about: [
                { "@type": "Thing", name: t("geo.about.membership") },
                { "@type": "Thing", name: t("geo.about.volunteering") },
                { "@type": "Thing", name: t("geo.about.travel") },
            ],
            isPartOf: {
                "@type": "WebSite",
                name: "GoodSurfing",
                url: getSeoUrl("/"),
            },
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
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.title,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.description,
                },
            })),
        },
    ];

    return (
        <MainPageLayout>
            <SeoHelmet
                title={t("seo.title")}
                description={t("seo.description")}
                canonicalUrl={canonicalUrl}
                keywords={t("seo.keywords")}
                ogTitle={t("seo.ogTitle")}
                ogDescription={t("seo.ogDescription")}
                alternateUrls={alternateUrls}
                structuredData={structuredData}
            />
            <div className={styles.innerWrapper}>
                <Header />
                <WhyMembership />
                <ForVolunteer className={styles.section} />
                <HowItWorks className={styles.section} />
                {/* Правка бизнеса: международный клуб — между личным
                    членством и членством для организаторов, а не после
                    обоих блоков покупки (как было по прежнему ТЗ). */}
                <InternationalClub className={styles.section} />
                <ForHost className={styles.section} />
                <DonationSection className={styles.section} />
                <WhatIsGoodsurfing className={styles.section} />
                <Review className={styles.section} />
                <Questions className={styles.section} />
            </div>
        </MainPageLayout>
    );
};

export default MembershipPage;

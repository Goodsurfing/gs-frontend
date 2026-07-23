import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { GetDonation, useLazyGetDonationByIdQuery } from "@/entities/Donation";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { getDonationPersonalPage } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";
import { DonationSubmenu } from "@/widgets/Donation";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import { DonationPageContent } from "../DonationPageContent/DonationPageContent";
import { DonationPersonalCard } from "../DonationPersonalCard/DonationPersonalCard";
import styles from "./DonationPersonalPage.module.scss";

export const DonationPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const [donationData, setDonationData] = useState<GetDonation>();
    const { myProfile } = useAuth();
    const { locale } = useLocale();
    const { ready } = useTranslation();
    const { t: tDonation, ready: readyDonation } = useTranslation("donation");

    const [getDonationData, { isLoading, isError }] = useLazyGetDonationByIdQuery();

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                if (id) {
                    const result = await getDonationData({ id, lang: locale });
                    if (result.data) {
                        setDonationData(result.data);
                    }
                }
            } catch { /* empty */ }
        };

        fetchDonations();
    }, [getDonationData, id, locale]);

    if (isLoading || !ready || !readyDonation) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id || isError) {
        return (
            <div className={styles.wrapper}>
                <MainHeader variant="static" />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text="Произошла ошибка"
                    />
                </div>
                <Footer />
            </div>
        );
    }

    if (donationData) {
        if (donationData.status === "draft") {
            return (
                <div className={styles.wrapper}>
                    <MainHeader variant="static" />
                    <div className={styles.content}>
                        <Text
                            className={styles.error}
                            textSize="primary"
                            text="Сбор не опубликован"
                        />
                    </div>
                    <Footer />
                </div>
            );
        }

        const seoTitle = donationData.name || tDonation("personalSeo.title");
        const seoDescription = donationData.description
            ? getSeoDescription(donationData.description)
            : tDonation("personalSeo.description");
        const seoUrl = getSeoUrl(getDonationPersonalPage(locale, id));
        // og:image: краулерам нужен оригинал
        // eslint-disable-next-line no-restricted-syntax
        const seoImage = getMediaContent(donationData.image?.contentUrl)
            // og:image: краулерам нужен оригинал
            // eslint-disable-next-line no-restricted-syntax
            || getMediaContent(donationData.galleryImages?.[0]?.contentUrl);

        return (
            <div className={styles.wrapper}>
                <SeoHelmet
                    title={seoTitle}
                    description={seoDescription || tDonation("personalSeo.description")}
                    canonicalUrl={seoUrl}
                    keywords={tDonation("personalSeo.keywords")}
                    ogImage={seoImage}
                />
                <MainHeader variant="static" />
                <div className={styles.content}>
                    <DonationPersonalCard
                        id={id}
                        donationData={donationData}
                        isVolunteer={!!myProfile?.volunteer}
                    />
                    <DonationSubmenu
                        donationData={donationData}
                        isVolunteer={!!myProfile?.volunteer}
                    />
                    <DonationPageContent donationData={donationData} />
                </div>
                <Footer />
            </div>
        );
    }

    return null;
};

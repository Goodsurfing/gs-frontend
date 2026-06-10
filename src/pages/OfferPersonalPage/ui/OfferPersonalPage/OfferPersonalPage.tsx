import { useParams, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { OfferSubmenu } from "@/widgets/OfferSubmenu";

import { Offer, useLazyGetOfferByIdQuery } from "@/entities/Offer";

import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import { Text } from "@/shared/ui/Text/Text";

import { OfferPageContent } from "../OfferPageContent/OfferPageContent";
import { OfferPersonalCard } from "../OfferPersonalCard/OfferPersonalCard";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import styles from "./OfferPersonalPage.module.scss";

export const OfferPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [offerData, setOfferData] = useState<Offer>();
    const { myProfile } = useAuth();
    const { locale } = useLocale();
    const { ready } = useTranslation();
    const { t: tMain, ready: readyMain } = useTranslation("main");
    const { ready: readyOffer } = useTranslation("offer");

    const [getOfferData, { isLoading, isError }] = useLazyGetOfferByIdQuery();

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const result = await getOfferData(id ?? "");
                if (result.data) {
                    setOfferData(result.data);
                }
            } catch { /* empty */ }
        };

        fetchOffers();
    }, [getOfferData, id]);

    if (isLoading || !ready || !readyMain || !readyOffer) {
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
                        text="Вакансия не найдена или произошла ошибка"
                    />
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        Назад
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    if (offerData) {
        if (offerData.status === "draft") {
            return (
                <div className={styles.wrapper}>
                    <MainHeader />
                    <div className={styles.content}>
                        <Text
                            className={styles.error}
                            textSize="primary"
                            text="Вакансия не опубликована"
                        />
                    </div>
                    <Footer />
                </div>
            );
        }

        const seoTitle = offerData.description?.title || tMain("seo.title");
        const seoDescription = offerData.description?.shortDescription
            || offerData.description?.description
            || tMain("seo.description");
        const seoUrl = getSeoUrl(getOfferPersonalPageUrl(locale, id));
        const seoImage = getMediaContent(offerData.description?.image?.contentUrl);

        return (
            <div className={styles.wrapper}>
                <SeoHelmet
                    title={seoTitle}
                    description={seoDescription}
                    canonicalUrl={seoUrl}
                    ogImage={seoImage}
                />
                <MainHeader />
                <div className={styles.content}>
                    <OfferPersonalCard
                        id={id}
                        offerData={offerData}
                        isVolunteer={!!myProfile?.volunteer}
                    />
                    <OfferSubmenu offerData={offerData} isVolunteer={!!myProfile?.volunteer} />
                    <OfferPageContent offerData={offerData} />
                </div>
                <Footer />
            </div>
        );
    }

    return null;
};

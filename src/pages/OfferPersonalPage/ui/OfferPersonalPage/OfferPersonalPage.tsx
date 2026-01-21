import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";
import { OfferSubmenu } from "@/widgets/OfferSubmenu";

import { Offer, useLazyGetOfferByIdQuery } from "@/entities/Offer";

import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";

import { OfferPageContent } from "../OfferPageContent/OfferPageContent";
import { OfferPersonalCard } from "../OfferPersonalCard/OfferPersonalCard";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import styles from "./OfferPersonalPage.module.scss";

export const OfferPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const [offerData, setOfferData] = useState<Offer>();
    const { myProfile } = useAuth();
    const { ready } = useTranslation();
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

    if (isLoading || !ready || !readyOffer) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id || isError) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
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

        return (
            <div className={styles.wrapper}>
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

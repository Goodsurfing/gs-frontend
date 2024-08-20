import { useParams } from "react-router-dom";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import { Text } from "@/shared/ui/Text/Text";

import { OfferPageContent } from "../OfferPageContent/OfferPageContent";
import { OfferPersonalCard } from "../OfferPersonalCard/OfferPersonalCard";
import styles from "./OfferPersonalPage.module.scss";
import { OfferSubmenu } from "@/widgets/OfferSubmenu";
import { useGetOfferByIdQuery } from "@/entities/Offer";
import Preloader from "@/shared/ui/Preloader/Preloader";

export const OfferPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data: offerData, isLoading } = useGetOfferByIdQuery(id || "");

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id || !offerData) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text className={styles.error} textSize="primary" text="Произошла ошибка" />
                </div>
                <Footer />
            </div>
        );
    }

    if (offerData.status === "empty") {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text className={styles.error} textSize="primary" text="Вакансия не опубликована" />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <OfferPersonalCard id={id} />
                <OfferSubmenu id={id} />
                <OfferPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};

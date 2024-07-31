import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import { Text } from "@/shared/ui/Text/Text";

import { OfferPageContent } from "../OfferPageContent/OfferPageContent";
import { OfferPersonalCard } from "../OfferPersonalCard/OfferPersonalCard";
import styles from "./OfferPersonalPage.module.scss";
import { OfferSubmenu } from "@/widgets/OfferSubmenu";

export const OfferPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div className={styles.wrapper}>
                <Text textSize="primary" text="Произошла ошибка" />
            </div>
        );
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const onImagesClick = useCallback(() => {}, []);

    return (
        <div className={styles.wrapper}>
            <MainHeader />
            <div className={styles.content}>
                <OfferPersonalCard id={id} onImagesClick={onImagesClick} />
                <OfferSubmenu offerId={id} />
                <OfferPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};

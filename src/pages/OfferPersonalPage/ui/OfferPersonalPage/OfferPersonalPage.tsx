import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { Submenu } from "@/widgets/Submenu";
import { Footer } from "@/widgets/Footer";

import { Text } from "@/shared/ui/Text/Text";

import { SubmenuItems } from "../../model/data/submenuData";
import { OfferPageContent } from "../OfferPageContent/OfferPageContent";
import { OfferPersonalCard } from "../OfferPersonalCard/OfferPersonalCard";

import styles from "./OfferPersonalPage.module.scss";

export const OfferPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return (
            <div className={styles.wrapper}>
                <Text textSize="primary" text="Произошла ошибка" />
            </div>
        );
    }

    const onImagesClick = useCallback(() => {

    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <OfferPersonalCard id={id} onImagesClick={onImagesClick} />
                <Submenu className={styles.navMenu} items={SubmenuItems} />
                <OfferPageContent id={id} />
            </div>
            <Footer />
        </div>
    );
};

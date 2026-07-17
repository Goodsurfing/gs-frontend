import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./FavoriteOffersPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { FavoriteOffers } from "./FavoriteOffers/FavoriteOffers";

const FavoriteOffersPage = () => {
    const { t } = useTranslation("offer");

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>{t("Избранные вакансии")}</h1>
                <FavoriteOffers />
            </div>
        </MainPageLayout>
    );
};

export default FavoriteOffersPage;

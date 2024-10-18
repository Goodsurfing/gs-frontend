import React from "react";
import styles from "./FavoriteOffersPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { FavoriteOffers } from "./FavoriteOffers/FavoriteOffers";

const FavoriteOffersPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Избранные вакансии</h1>
            <FavoriteOffers />
        </div>
    </MainPageLayout>
);

export default FavoriteOffersPage;

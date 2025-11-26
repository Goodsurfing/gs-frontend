import React from "react";

import { useTranslation } from "react-i18next";
import { CategoriesWidget } from "@/widgets/CategoriesWidget";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import styles from "./CategoriesPage.module.scss";

const CategoriesPage = () => {
    const { t } = useTranslation();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>{t("category-offer.Выбирайте по интересам")}</h2>
                <CategoriesWidget className={styles.container} />
            </div>
        </MainPageLayout>
    );
};

export default CategoriesPage;

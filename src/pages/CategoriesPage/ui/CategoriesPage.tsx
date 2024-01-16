import React from "react";

import { CategoriesWidget } from "@/widgets/CategoriesWidget";

import styles from "./CategoriesPage.module.scss";
import { MainPageLayout } from "@/widgets/MainPageLayout";

const CategoriesPage = () => (
    <MainPageLayout>
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Выбирайте по интересам</h2>
            <CategoriesWidget className={styles.container} />
        </div>
    </MainPageLayout>
);

export default CategoriesPage;

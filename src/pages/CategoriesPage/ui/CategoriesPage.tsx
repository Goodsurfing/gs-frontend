import React from "react";

import { CategoriesWidget } from "@/widgets/CategoriesWidget";

import styles from "./CategoriesPage.module.scss";

const CategoriesPage = () => (
    <div className={styles.wrapper}>
        <h2 className={styles.title}>Выбирайте по интересам</h2>
        <CategoriesWidget className={styles.container} />
    </div>
);

export default CategoriesPage;

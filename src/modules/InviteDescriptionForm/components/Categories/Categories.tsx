import React from "react";

import { OfferCategories } from "@/widgets/OfferCategories";
import styles from "./Categories.module.scss";

const Categories = () => (
    <div className={styles.wrapper}>
        <p className={styles.title}>Категория приглашения</p>
        <OfferCategories />
    </div>
);

export default Categories;

import React from "react";

import styles from "./OfferWhoNeedsPage.module.scss";

import { WhoNeedsForm } from "@/modules/WhoNeedsForm";

const OffersWhoNeedsPage = () => (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>Кого бы вы хотели видеть у себя в волонтерах</h1>
        <p className={styles.subtitle}>Опишите, что должен уметь волонтер, что он должен делать и на каких языках вы с ним можете общаться.</p>
        <WhoNeedsForm />
    </div>
);

export default OffersWhoNeedsPage;

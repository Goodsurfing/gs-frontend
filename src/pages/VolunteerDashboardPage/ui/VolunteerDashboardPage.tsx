import React from "react";

import { VolunteerFill } from "@/features/VolunteerFill";
import styles from "./VolunteerDashboardPage.module.scss";
import { OffersRecomendationsWidget } from "@/widgets/OffersRecomendationsWidget";

const VolunteerDashboardPage = () => (
    <div className={styles.dashboard}>
        <VolunteerFill />
        <div className={styles.columns}>
            <OffersRecomendationsWidget />
            <h3>NOTIFICATIONS</h3>
        </div>
    </div>
);

export default VolunteerDashboardPage;

import React from "react";

import { VolunteerFill } from "@/features/VolunteerFill";
import styles from "./VolunteerDashboardPage.module.scss";
import { OffersRecomendationsWidget } from "@/widgets/OffersRecomendationsWidget";
import { MemberBanner } from "@/features/MemberBanner";
import { DashboardNotifications } from "@/widgets/DashboardNotifications";

const VolunteerDashboardPage = () => (
    <div className={styles.dashboard}>
        <VolunteerFill />
        <div className={styles.columns}>
            <OffersRecomendationsWidget />
            <div className={styles.container}>
                <MemberBanner />
                <DashboardNotifications />
            </div>
        </div>
    </div>
);

export default VolunteerDashboardPage;
